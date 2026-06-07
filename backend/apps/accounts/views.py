from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.core.cache import cache
from .serializers import (
    RegisterSerializer, 
    CustomTokenObtainPairSerializer, 
    UserProfileSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)

User = get_user_model()

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # We need to map email to username for SimpleJWT to work natively
        data = request.data.copy()
        if "email" in data and "username" not in data:
            data["username"] = data["email"]
        
        serializer = self.get_serializer(data=data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": e.detail if hasattr(e, 'detail') else str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Operation successful",
            "data": serializer.validated_data
        }, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "success": True,
            "message": "Registration successful",
            "data": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserProfileSerializer(user).data
            }
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "message": "Operation successful",
            "data": serializer.data
        })

class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ForgotPasswordSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        
        if user:
            token = get_random_string(length=32)
            cache.set(f"reset_token_{token}", user.id, timeout=3600) # Valid for 1 hour
            
            # Use console email backend for development
            send_mail(
                'Password Reset Request',
                f'Your password reset token is: {token}\nSend this to the /api/auth/reset-password/ endpoint.',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            
        return Response({
            "success": True,
            "message": "If an account with that email exists, we have sent a password reset link.",
            "data": {}
        })

class ResetPasswordView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        
        user_id = cache.get(f"reset_token_{token}")
        if not user_id:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": {"token": ["Invalid or expired token."]}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.get(id=user_id)
        user.set_password(password)
        user.save()
        
        cache.delete(f"reset_token_{token}")
        
        return Response({
            "success": True,
            "message": "Password reset successfully.",
            "data": {}
        })
