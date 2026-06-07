from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from django.contrib.auth import get_user_model
from products.models import Product
from categories.models import Category
from orders.models import Order

from .serializers import (
    AdminUserSerializer,
    AdminCategorySerializer,
    AdminProductSerializer,
    AdminOrderSerializer
)
from .permissions import IsAdminUser

User = get_user_model()

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(status='completed').aggregate(total=Sum('total_price'))['total'] or 0
        total_products = Product.objects.count()

        recent_orders = AdminOrderSerializer(Order.objects.order_by('-created_at')[:5], many=True).data
        latest_users = AdminUserSerializer(User.objects.order_by('-date_joined')[:5], many=True).data
        low_stock_products = AdminProductSerializer(Product.objects.filter(stock__lt=10).order_by('stock')[:5], many=True).data

        return Response({
            'total_users': total_users,
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'total_products': total_products,
            'recent_orders': recent_orders,
            'latest_users': latest_users,
            'low_stock_products': low_stock_products
        })

class AnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Last 30 days revenue
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_revenue = Order.objects.filter(
            status='completed', created_at__gte=thirty_days_ago
        ).extra({'day': "date(created_at)"}).values('day').annotate(revenue=Sum('total_price')).order_by('day')
        
        return Response({
            'daily_revenue': list(daily_revenue),
        })

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAdminUser]

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser]

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminUser]
