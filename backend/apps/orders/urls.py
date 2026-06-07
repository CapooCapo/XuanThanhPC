from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import OrderViewSet, CheckoutView

router = SimpleRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('', include(router.urls)),
]
