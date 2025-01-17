# Generated by Django 5.0.6 on 2024-06-26 09:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chercheur',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=100)),
                ('specialite', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ProjetRecherche',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('date_debut', models.DateField()),
                ('date_fin_prevue', models.DateField()),
                ('chef_projet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projets_diriges', to='recherche.chercheur')),
            ],
        ),
        migrations.AddField(
            model_name='chercheur',
            name='liste_projets',
            field=models.ManyToManyField(related_name='chercheurs', to='recherche.projetrecherche'),
        ),
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(max_length=100)),
                ('resume', models.TextField()),
                ('date_publication', models.DateField()),
                ('projet_associe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='publications', to='recherche.projetrecherche')),
            ],
        ),
    ]
