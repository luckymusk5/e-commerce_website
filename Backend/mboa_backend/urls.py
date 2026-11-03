from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('mboa_accounts.urls')),
    path('api/products/', include('mboa_accounts.product_urls')),
]
