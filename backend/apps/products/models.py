from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    short_description = models.TextField(blank=True, null=True)
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField(default=0)
    specifications = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 3D Builder Lab Fields
    model3d_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL to GLTF/GLB model")
    power_draw = models.IntegerField(default=0, help_text="Power consumption in watts")
    socket = models.CharField(max_length=50, blank=True, help_text="CPU socket or Motherboard socket support")
    gpu_length = models.FloatField(blank=True, null=True, help_text="Length in mm (for GPU and Case clearance)")
    cooler_height = models.FloatField(blank=True, null=True, help_text="Height in mm (for Cooler and Case clearance)")
    form_factor = models.CharField(max_length=50, blank=True, help_text="ATX, Micro-ATX, etc.")
    pcie_slots = models.IntegerField(default=0)
    m2_slots = models.IntegerField(default=0)
    sata_ports = models.IntegerField(default=0)
    gaming_score = models.FloatField(default=0.0)
    productivity_score = models.FloatField(default=0.0)
    
    main_image = models.ForeignKey(
        'ProductImage',
        null=True,
        blank=True,
        related_name='main_for_products',
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']
