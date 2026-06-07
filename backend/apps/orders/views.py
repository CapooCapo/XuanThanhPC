from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutSerializer
from cart.models import Cart
from cart.views import CartViewSet

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Either authenticated user looking at their orders, or guest by session?
            # For simplicity, if authenticated return their orders. 
            # In a real app, might want to allow looking up by order_number for guests.
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user).order_by('-created_at')
        return Order.objects.none()

class CheckoutView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CheckoutSerializer

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        cart_viewset = CartViewSet()
        cart = cart_viewset._get_or_create_cart(request)
        
        if not cart.items.exists():
            return Response({
                "success": False,
                "message": "Cart is empty",
                "errors": {"cart": ["Cannot checkout an empty cart."]}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Create Order
        data = serializer.validated_data
        order = Order(
            user=request.user if request.user.is_authenticated else None,
            full_name=data['full_name'],
            phone=data['phone'],
            email=data['email'],
            address=data['address'],
            city=data['city'],
            district=data['district'],
            notes=data.get('notes', ''),
            payment_method=data['payment_method'],
            total_price=cart.total_price
        )
        order.save()
        
        # Create Order Items and update stock
        for cart_item in cart.items.all():
            product = cart_item.product
            if product.stock < cart_item.quantity:
                transaction.set_rollback(True)
                return Response({
                    "success": False,
                    "message": "Validation failed",
                    "errors": {"stock": [f"Not enough stock for {product.name}."]}
                }, status=status.HTTP_400_BAD_REQUEST)
                
            product.stock -= cart_item.quantity
            product.save()
            
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
            )
            
        # Clear cart
        cart.items.all().delete()
        cart.update_totals()
        
        return Response({
            "success": True,
            "message": "Checkout successful",
            "data": OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)
