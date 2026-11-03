from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Product


def product_data(product):
    return {
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'category': product.category,
        'description': product.description,
        'features': product.features,
        'price': str(product.price),
        'old_price': str(product.old_price) if product.old_price is not None else None,
        'currency': product.currency,
        'stock': product.stock,
        'badge': product.badge,
        'image_url': product.image_url,
    }


@require_GET
def products(request):
    queryset = Product.objects.filter(is_active=True)
    category = request.GET.get('category')
    if category:
        queryset = queryset.filter(category__iexact=category)
    return JsonResponse({'products': [product_data(product) for product in queryset]})


@require_GET
def product_detail(request, slug):
    product = Product.objects.filter(slug=slug, is_active=True).first()
    if product is None:
        return JsonResponse({'error': 'Produit introuvable.'}, status=404)
    return JsonResponse({'product': product_data(product)})