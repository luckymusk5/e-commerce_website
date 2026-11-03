from django.contrib import admin

from .models import CustomerProfile, Product, Purchase

admin.site.site_header = 'Mboa Market administration'
admin.site.site_title = 'Mboa Market admin'
admin.site.index_title = 'Gestion de la boutique'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_active', 'updated_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'slug', 'category', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'stock', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Informations générales', {'fields': ('name', 'slug', 'category', 'description', 'features')}),
        ('Prix et stock', {'fields': ('price', 'old_price', 'currency', 'stock', 'badge')}),
        ('Visuel et publication', {'fields': ('image_url', 'is_active')}),
        ('Traçabilité', {'fields': ('created_at', 'updated_at')}),
    )


admin.site.register(CustomerProfile)
admin.site.register(Purchase)