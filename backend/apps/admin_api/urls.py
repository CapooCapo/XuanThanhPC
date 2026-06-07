from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardStatsView,
    AnalyticsView,
    AdminUserViewSet,
    AdminCategoryViewSet,
    AdminProductViewSet,
    AdminOrderViewSet
)

router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-user')
router.register(r'categories', AdminCategoryViewSet, basename='admin-category')
router.register(r'products', AdminProductViewSet, basename='admin-product')
router.register(r'orders', AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='admin-dashboard'),
    path('analytics/', AnalyticsView.as_view(), name='admin-analytics'),
    path('', include(router.urls)),
]
