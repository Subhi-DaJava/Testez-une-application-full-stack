# Yoga App

## Prérequis

- Java 11
- NodeJS 16
- MySQL
- Angular CLI 14

## Installation de la base de données

1. Installez MySQL sur votre machine.
2. Exécutez le script SQL pour créer le schéma de la base de données. Le script est disponible à l'emplacement `ressources/sql/script.sql`.

## Installation de l'application

### Backend

1. Clonez le dépôt : `git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing`.
2. Allez dans le dossier du backend : `cd back`.
3. Avant d'installer les dépendances avec Maven, assurez-vous que la version de Java utilisée est la 11. Si la version de Java installée globalement sur votre machine est supérieure à 11, vous pouvez utiliser les commandes suivantes dans votre terminal pour définir temporairement la version de Java à utiliser pour l'exécution de Maven :
    ```bash
    export JAVA_HOME="/chemin/Java/jdk-11"
    export PATH="$JAVA_HOME/bin:$PATH"
    ```
    Ces commandes permettent d'utiliser Java 11 pour l'exécution de Maven sans modifier la version principale de Java installée sur votre machine.
    Dans votre IDE, vous pouvez également configurer la version de Java à utiliser pour le projet à la version 11.
4. Installez les dépendances avec Maven : `mvn clean install`.

### Frontend
1. Allez dans le dossier du frontend : `cd front`. (Si vous êtes déjà dans le dossier du backend, vous pouvez utiliser la commande `cd ../front`).
2. Installez les dépendances avec npm : `npm install`.

## Exécution de l'application

### Backend 
1. Allez dans le dossier du backend : `cd back`. 
2. Exécutez l'application avec Maven : `mvn spring-boot:run`.
   #### Lancement de l'application avec le JAR
    1. Allez dans le dossier du backend : `cd back`.
    2. Allez dans le dossier target : `cd target`.
    3. Exécutez l'application avec le JAR : `java -jar yoga-0.0.1-SNAPSHOT.jar.` (Le fichier JAR a été généré à l'étape 4 de l'installation du backend.)

### Frontend
1. Allez dans le dossier du frontend : `cd front`. (Si vous êtes déjà dans le dossier du backend, vous pouvez utiliser la commande `cd ../front`).
2. Lancez l'application avec npm : `ng serve`.
3. Ouvrez votre navigateur et allez à l'adresse `http://localhost:4200/`.
4. Pour vous connecter à l'application, utilisez l'identifiant suivant (par défaut, le compte administrateur) :
   - identifiant : yoga@studio.com
   - mot de passe : test!1234


### Testing 
#### Jest (Frontend)
1. Allez dans le dossier du frontend : `cd front`.
2. Lancez l'application avec npm : `npm run test`. (Cette commande permet de lancer les tests unites et d'intégration.)
3. Lancez l'application avec npm : `npm run start:watch`. (Cette commande permet de lancer l'application en mode watch, c'est-à-dire que les modifications sont automatiquement prises en compte et pour suivre les modifications.)
4. Lancez l'application avec npm : `npm run start:coverage`. (Cette commande permet de lancer l'application avec le rapport de couverture, de visualiser le rapport de couverture en même temps que l'application, et le rapport est disponible ici :`front/coverage/jest/lcov-report/index.html`)

#### Cypress (Frontend E2E)
1. Allez dans le dossier du frontend : `cd front/cypress/e2e/`.
2. Lancez l'application avec angular CLI : `ng serve` ou avec npm : `npm run start`.
3. Lancez la commande : `npm run cypress:open`.
4. Cliquez sur le navigateur (Interface Cypress) `E2E Testing`.
5. Choisissez un navigateur (Chrome e.g.), et puis cliquez `Start E2E Testing in Chrome`.
6. Cliquez un test pour lancer le test E2E.


#### E2E Rapport de test 
Lancement du test e2e (dans le répertoire front) :
1. > npm run e2e

Génération du rapport de couverture (vous devriez lancer le test e2e avant) :
2.  > npm run e2e:coverage

Le rapport est disponible ici :
3. > front/coverage/lcov-report/index.html
   
### Testing Backend
1. Allez dans le dossier du backend : `cd back`. 
2. Exécutez les tests avec Maven : `mvn test`. 
3. Le rapport est disponible à l'emplacement `target/site/jacoco/index.html`.

### Rapport de tests
1. Rapport de test généré par Jest :
![img.png](img.png)

2. Rapport de test généré par JaCoCo :
![img_1.png](img_1.png)

3. Rapport de test généré par E2E :
![img_2.png](img_2.png)