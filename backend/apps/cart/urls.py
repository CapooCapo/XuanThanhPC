from django.urls import path
from .views import CartViewSet, AddToCartView, UpdateCartItemView, RemoveCartItemView, ClearCartView

urlpatterns = [
    path('', CartViewSet.as_view({'get': 'list'}), name='cart-list'),
    path('add/', AddToCartView.as_view(), name='cart-add'),
    path('item/<int:item_id>/', UpdateCartItemView.as_view(), name='cart-update'),
    path('item/<int:item_id>/remove/', RemoveCartItemView.as_view(), name='cart-remove'),
    path('clear/', ClearCartView.as_view(), name='cart-clear'),
]
