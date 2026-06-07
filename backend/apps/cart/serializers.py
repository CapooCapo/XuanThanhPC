from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductListSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    
    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_details', 'quantity', 'unit_price', 'subtotal')
        read_only_fields = ('unit_price', 'subtotal')

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_quantity = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ('id', 'user', 'session_id', 'total_price', 'total_quantity', 'items', 'created_at')
        read_only_fields = ('total_price', 'total_quantity', 'user', 'session_id')

    def get_total_quantity(self, obj):
        return sum(item.quantity for item in obj.items.all())
