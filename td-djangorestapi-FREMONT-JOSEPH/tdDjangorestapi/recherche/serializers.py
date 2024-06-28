from rest_framework import serializers
from .models import ProjetRecherche, Chercheur, Publication


class ProjetRechercheSerializer(serializers.ModelSerializer):
    chef_projet_nom = serializers.CharField(source='chef_projet.nom', read_only=True)

    class Meta:
        model = ProjetRecherche
        fields = '__all__'


class ChercheurSerializer(serializers.ModelSerializer):
    projets = serializers.PrimaryKeyRelatedField(many=True, queryset=ProjetRecherche.objects.all(), source='liste_projets')

    class Meta:
        model = Chercheur
        fields = ['id', 'nom', 'specialite', 'projets']
        # fields = '__all__'

    def get_projets_count(self, obj):
        return obj.liste_projets.count()


class PublicationSerializer(serializers.ModelSerializer):
    projet_associe_titre = serializers.CharField(source='projet_associe.titre', read_only=True)

    class Meta:
        model = Publication
        fields = '__all__'

class UserExistsSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Cet utilisateur n'existe pas.")
        return data


# class ParticipantSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Participant
#         fields = ['id', 'name', 'email']

# class EventSerializer(serializers.ModelSerializer):
#     participants = ParticipantSerializer(many=True, read_only=True)

#     class Meta:
#         model = Event
#         fields = ['id', 'name', 'location', 'date', 'description', 'participants']
#     def get_participants_count(self, obj):
#         return obj.participants.count()