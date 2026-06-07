from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product

class CartViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)
    
    def _get_or_create_cart(self, request):
        if request.user.is_authenticated:
            carts = Cart.objects.filter(user=request.user)
            if carts.exists():
                cart = carts.first()
                # Clean up duplicates if any
                if carts.count() > 1:
                    carts.exclude(id=cart.id).delete()
            else:
                cart = Cart.objects.create(user=request.user)
        else:
            session_id = request.session.session_key
            if not session_id:
                request.session.create()
                session_id = request.session.session_key
            
            carts = Cart.objects.filter(user=None, session_id=session_id)
            if carts.exists():
                cart = carts.first()
                # Clean up duplicates if any
                if carts.count() > 1:
                    carts.exclude(id=cart.id).delete()
            else:
                cart = Cart.objects.create(user=None, session_id=session_id)
        return cart

    def list(self, request):
        cart = self._get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response({
            "success": True,
            "message": "Cart retrieved successfully",
            "data": serializer.data
        })

class AddToCartView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CartItemSerializer

    def post(self, request, *args, **kwargs):
        cart_viewset = CartViewSet()
        cart = cart_viewset._get_or_create_cart(request)
        
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": {"quantity": ["Quantity must be positive."]}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        product = get_object_or_404(Product, id=product_id)
        
        if product.stock < quantity:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": {"stock": ["Not enough stock available."]}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={'quantity': quantity, 'unit_price': product.discount_price or product.price, 'subtotal': 0}
        )
        
        if not created:
            new_quantity = cart_item.quantity + quantity
            if product.stock < new_quantity:
                return Response({
                    "success": False,
                    "message": "Validation failed",
                    "errors": {"stock": ["Not enough stock available."]}
                }, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_quantity
            cart_item.save()
            
        return Response({
            "success": True,
            "message": "Item added to cart",
            "data": CartSerializer(cart).data
        })

class UpdateCartItemView(generics.UpdateAPIView):
    permission_classes = (AllowAny,)
    
    def patch(self, request, item_id, *args, **kwargs):
        cart_viewset = CartViewSet()
        cart = cart_viewset._get_or_create_cart(request)
        
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": {"quantity": ["Quantity must be positive."]}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        if cart_item.product.stock < quantity:
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": {"stock": ["Not enough stock available."]}
            }, status=status.HTTP_400_BAD_REQUEST)
            
        cart_item.quantity = quantity
        cart_item.save()
        
        return Response({
            "success": True,
            "message": "Cart updated successfully",
            "data": CartSerializer(cart).data
        })

class RemoveCartItemView(generics.DestroyAPIView):
    permission_classes = (AllowAny,)
    
    def delete(self, request, item_id, *args, **kwargs):
        cart_viewset = CartViewSet()
        cart = cart_viewset._get_or_create_cart(request)
        
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        
        return Response({
            "success": True,
            "message": "Item removed from cart",
            "data": CartSerializer(cart).data
        })

class ClearCartView(generics.DestroyAPIView):
    permission_classes = (AllowAny,)

    def delete(self, request, *args, **kwargs):
        cart_viewset = CartViewSet()
        cart = cart_viewset._get_or_create_cart(request)
        
        # Delete all items in the cart
        cart.items.all().delete()
        
        # update_totals is called in CartItem delete, but bulk delete doesn't trigger signals or overridden delete method
        cart.update_totals()
        
        return Response({
            "success": True,
            "message": "Cart cleared successfully",
            "data": CartSerializer(cart).data
        })
