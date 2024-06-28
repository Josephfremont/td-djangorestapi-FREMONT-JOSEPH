from django.contrib import admin
from .models import ProjetRecherche, Chercheur, Publication

@admin.register(ProjetRecherche)
class ProjetRechercheAdmin(admin.ModelAdmin):
    list_display = ('titre', 'date_debut', 'date_fin_prevue', 'chef_projet')
    search_fields = ('titre', 'description')

@admin.register(Chercheur)
class ChercheurAdmin(admin.ModelAdmin):
    list_display = ('nom', 'specialite')
    filter_horizontal = ('liste_projets',)

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'projet_associe', 'date_publication')
    list_filter = ('projet_associe',)
