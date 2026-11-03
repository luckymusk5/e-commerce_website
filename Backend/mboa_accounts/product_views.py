import decimal
import json

from django.http import JsonResponse
from django.utils.text import slugify
from django.views.decorators.http import require_GET, require_http_methods

from .models import Product


def body(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return None


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


@require_http_methods(['GET', 'POST'])
def products(request):
    if request.method == 'POST':
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({'error': 'Accès administrateur requis.'}, status=403)
        data = body(request)
        if data is None:
            return JsonResponse({'error': 'JSON invalide.'}, status=400)
        name = str(data.get('name', '')).strip()
        category = str(data.get('category', '')).strip()
        if not name or not category:
            return JsonResponse({'error': 'Le nom et la catégorie sont requis.'}, status=400)
        slug = slugify(name)
        if Product.objects.filter(slug=slug).exists():
            return JsonResponse({'error': 'Un produit avec ce nom existe déjà.'}, status=409)
        try:
            product = Product.objects.create(
                name=name, slug=slug, category=category,
                description=str(data.get('description', '')),
                features=data.get('features', []), price=data.get('price', 0),
                old_price=data.get('old_price'), currency=str(data.get('currency', 'XAF')),
                stock=data.get('stock', 0), badge=str(data.get('badge', '')),
                image_url=str(data.get('image_url', '')), is_active=True,
            )
        except (TypeError, ValueError, decimal.InvalidOperation):
            return JsonResponse({'error': 'Les valeurs du prix ou du stock sont invalides.'}, status=400)
        return JsonResponse({'product': product_data(product)}, status=201)
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