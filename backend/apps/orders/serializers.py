from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_details', 'quantity', 'unit_price', 'subtotal')
        read_only_fields = ('product_name', 'unit_price', 'subtotal')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'user', 'status', 'total_price', 'payment_method',
            'full_name', 'phone', 'email', 'address', 'city', 'district', 'notes',
            'shipping_address', 'items', 'created_at'
        )
        read_only_fields = ('order_number', 'status', 'total_price', 'shipping_address', 'user')

class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    district = serializers.CharField(max_length=100)
    notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField(max_length=50)
