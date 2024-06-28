from django.urls import include, path
from rest_framework.routers import SimpleRouter
from .views import ProjetRechercheViewSet, ChercheurViewSet, PublicationViewSet, check_user_exists
from rest_framework.authtoken.views import obtain_auth_token

# Création de SimpleRouter avec trailing_slash=False
router = SimpleRouter(trailing_slash=False)

router.register(r'projets', ProjetRechercheViewSet)
router.register(r'chercheurs', ChercheurViewSet)
router.register(r'publications', PublicationViewSet)

# Inclure les routes du router dans les urlpatterns de l'application
urlpatterns = [
    path('', include(router.urls)),
    path('check-user', check_user_exists, name='check_user_exists'),
    path('api-token-auth', obtain_auth_token, name='api_token_auth'),
]
