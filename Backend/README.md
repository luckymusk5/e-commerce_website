# Mboa Market Backend

## Administration

L'interface sécurisée de gestion des produits est disponible sur `/admin/`.

Elle permet de gérer :

- nom et slug du produit ;
- catégorie ;
- description et caractéristiques ;
- prix, ancien prix et devise ;
- stock et badge promotionnel ;
- image ;
- activation ou désactivation du produit.

Seuls les utilisateurs Django avec `is_staff=True` peuvent accéder à l'administration.

```powershell
.\env\Scripts\python.exe manage.py migrate
.\env\Scripts\python.exe manage.py createsuperuser
.\env\Scripts\python.exe manage.py runserver
```

## API publique

- `GET /api/products/`
- `GET /api/products/<slug>/`

Seuls les produits actifs sont exposés par l'API publique. La création et la modification se font uniquement depuis l'administration sécurisée.

## Configuration

Copier `.env.example` vers `.env`, puis renseigner les identifiants PostgreSQL de `mboadatabase`.
