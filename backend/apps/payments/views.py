from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class PaymentProcessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"status": "success", "message": "Payment processed successfully"})
