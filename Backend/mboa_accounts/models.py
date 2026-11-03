from django.contrib.auth.models import User
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    features = models.JSONField(default=list, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    old_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='XAF')
    stock = models.PositiveIntegerField(default=0)
    badge = models.CharField(max_length=40, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    phone = models.CharField(max_length=30, blank=True)
    city = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email or self.user.username


class Purchase(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('paid', 'Payee'),
        ('shipped', 'Expediee'),
        ('delivered', 'Livree'),
        ('cancelled', 'Annulee'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    reference = models.CharField(max_length=40, unique=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='XAF')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    items = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
