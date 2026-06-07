from rest_framework import serializers
from .models import Product, ProductImage
from categories.models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image', 'alt_text')

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    discount_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'short_description', 'category',
            'price', 'discount_price', 'main_image', 'is_active', 'created_at'
        )

    def get_main_image(self, obj):
        if obj.main_image and obj.main_image.image:
            return obj.main_image.image.url
        elif obj.images.first():
            return obj.images.first().image.url
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    discount_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'short_description', 'category',
            'price', 'discount_price', 'stock', 'main_image', 'images',
            'specifications', 'is_active', 'created_at'
        )

    def get_main_image(self, obj):
        if obj.main_image and obj.main_image.image:
            return obj.main_image.image.url
        elif obj.images.first():
            return obj.images.first().image.url
        return None
