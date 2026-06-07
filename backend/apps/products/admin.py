from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['preview_image']

    def preview_image(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" style="border-radius:8px;" />',
                obj.image.url
            )
        return "-"
    preview_image.short_description = 'Preview'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ('name', 'category', 'price', 'stock', 'main_image_preview')
    search_fields = ('name', 'slug')
    list_filter = ('category', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "main_image":
            import re
            match = re.match(r'.*/(\d+)/change/', request.path)
            if match:
                product_id = match.group(1)
                kwargs["queryset"] = ProductImage.objects.filter(product_id=product_id)
            else:
                kwargs["queryset"] = ProductImage.objects.none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def main_image_preview(self, obj):
        if obj.main_image and obj.main_image.image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius:4px;" />',
                obj.main_image.image.url
            )
        return "-"
    main_image_preview.short_description = 'Main Image'
