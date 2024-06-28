from rest_framework import viewsets, status
from .models import ProjetRecherche, Chercheur, Publication
from .serializers import ProjetRechercheSerializer, ChercheurSerializer, PublicationSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class ProjetRechercheViewSet(viewsets.ModelViewSet):
    queryset = ProjetRecherche.objects.all()
    serializer_class = ProjetRechercheSerializer

class ChercheurViewSet(viewsets.ModelViewSet):
    queryset = Chercheur.objects.all()
    serializer_class = ChercheurSerializer

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer

@api_view(['GET'])
def check_user_exists(request):
    username = request.headers.get('user', None)
    password = request.headers.get('password', None)

    if not username or not password:
        return Response({'error': 'Missing user or password in query parameters'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        return Response({'exists': "token 1834d84ca3cb557c25eff800beb2b70971883a63"}, status=status.HTTP_200_OK)
    else:
        return Response({'exists': False}, status=status.HTTP_404_NOT_FOUND)


