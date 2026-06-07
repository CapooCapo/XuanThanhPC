from django.urls import path
from .views import PaymentProcessView

urlpatterns = [
    path('', PaymentProcessView.as_view(), name='payment-process'),
]
