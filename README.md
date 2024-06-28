### Initialisation et lancement de l'api ###

## Activer l'environnement ##
cd td-djangorestapi-FREMONT-JOSEPH
pip install virtualenv
python -m venv ./venv
source venv/bin/activate

## Installer les packages ##
pip install -r requirements.txt

## Se déplacer dans le projet ##
cd tdDjangorestapi

## Lancement des migrations ##
python manage.py makemigrations
python manage.py migrate

## Créer un utilisateur ##
python manage.py createsuperuser

## Lancer l'api ##
python manage.py runserver

### Lancer le front (dans un autre terminal) ###
Déplacez vous dans le dossier front-react

## Installer les packages ##
npm install

## lancer le server ##
npm start


## Accéder au front ##
http://localhost:3000/

Dans l'interface de connexion intégrer l'utilisateur et le mot de passe créer précédemment àà la suite de la commande "python manage.py createsuperuser"