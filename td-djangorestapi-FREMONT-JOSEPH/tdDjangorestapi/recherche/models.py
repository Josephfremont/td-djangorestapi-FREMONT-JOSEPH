from django.db import models

# Projet de Recherche
# - Titre (char)
# - Description (text)
# - Date de début (date)
# - Date de fin prévue (date)
# - Chef de projet (foreign key vers Chercheur)
class ProjetRecherche(models.Model):
    titre = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date_debut = models.DateField()
    date_fin_prevue = models.DateField()
    chef_projet = models.ForeignKey('Chercheur', on_delete=models.CASCADE)
    def __str__(self):
        return self.titre

# Chercheur
# - Nom (char)
# - Spécialité (char)
# - Liste des projets (many-to-many avec Projet de Recherche)
class Chercheur(models.Model):
    nom = models.CharField(max_length=100)
    specialite = models.CharField(max_length=100)
    liste_projets = models.ManyToManyField(ProjetRecherche, related_name='chercheurs',blank=True)

    def __str__(self):
        return self.nom

# Publication
# - Titre (char)
# - Résumé (text)
# - Projet associé (foreign key vers Projet de Recherche)
# - Date de publication (date)
class Publication(models.Model):
    titre = models.CharField(max_length=100)
    resume = models.TextField()
    projet_associe = models.ForeignKey(ProjetRecherche, on_delete=models.CASCADE, related_name='publications', blank=True)
    date_publication = models.DateField()

    def __str__(self):
        return self.titre
