import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import CustomerProfile


def body(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return None


def user_data(user):
    return {
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
    }


@csrf_exempt
@require_POST
def register(request):
    data = body(request)
    if data is None:
        return JsonResponse({'error': 'JSON invalide.'}, status=400)
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    name = str(data.get('name', '')).strip()
    if not email or not password or not name:
        return JsonResponse({'error': 'Nom, e-mail et mot de passe sont requis.'}, status=400)
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Un compte existe deja avec cet e-mail.'}, status=409)
    first_name, _, last_name = name.partition(' ')
    user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
    CustomerProfile.objects.create(user=user)
    login(request, user)
    return JsonResponse({'user': user_data(user)}, status=201)


@csrf_exempt
@require_POST
def login_view(request):
    data = body(request)
    if data is None:
        return JsonResponse({'error': 'JSON invalide.'}, status=400)
    email = str(data.get('email', '')).strip().lower()
    user = authenticate(request, username=email, password=str(data.get('password', '')))
    if user is None:
        return JsonResponse({'error': 'E-mail ou mot de passe incorrect.'}, status=401)
    login(request, user)
    return JsonResponse({'user': user_data(user)})


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Deconnexion reussie.'})


@require_GET
def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})
    return JsonResponse({'authenticated': True, 'user': user_data(request.user)})


@require_GET
def history(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Connexion requise pour consulter votre historique.'}, status=401)
    purchases = request.user.purchases.values('reference', 'total_amount', 'currency', 'status', 'items', 'created_at')
    return JsonResponse({'purchases': list(purchases)}, safe=False)
