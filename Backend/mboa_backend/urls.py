from django.urls import include, path

urlpatterns = [
    path('api/auth/', include('mboa_accounts.urls')),
]
