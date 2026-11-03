from django.urls import path

from . import product_views

urlpatterns = [
    path('', product_views.products, name='products'),
    path('<slug:slug>/', product_views.product_detail, name='product-detail'),
]