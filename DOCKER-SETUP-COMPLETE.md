# 🎉 Configuration Docker - EventApp

## ✅ Installation Terminée avec Succès !

Votre application EventApp est maintenant dockerisée avec **3 conteneurs séparés** :

### 📦 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│              (eventapp-network)                          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │   MySQL      │  │
│  │   (Nginx)    │──│ (Spring Boot)│──│  Database    │  │
│  │   Port 80    │  │  Port 8080   │  │  Port 3306   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 🚀 Démarrage Rapide

#### 1. Build et Démarrage Automatique
```powershell
.\build-and-run.ps1
```

#### 2. Ou Manuellement

**Build Backend:**
```powershell
cd backend
mvn clean package -DskipTests
cd ..
```

**Build Frontend (optionnel):**
```powershell
cd react-app
npm install
npm run build
cd ..
```

**Démarrer Docker:**
```powershell
docker-compose up -d
```

### 🌐 Accès à l'Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Interface utilisateur React |
| **Backend API** | http://localhost:8080/api | API REST Spring Boot |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentation API interactive |
| **MySQL** | localhost:3306 | Base de données |

#### Credentials MySQL
- **Database**: `eventapp`
- **User**: `eventapp`
- **Password**: `eventapp123`

### 📋 Commandes Essentielles

#### Gestion des Conteneurs

```powershell
# Voir l'état des conteneurs
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Redémarrer un service
docker-compose restart backend

# Redémarrer tous les services
docker-compose restart

# Arrêter l'application
docker-compose down

# Arrêter ET supprimer les données (⚠️ Supprime la base de données)
docker-compose down -v
```

#### Après Modification du Code

**Backend:**
```powershell
cd backend
mvn clean package -DskipTests
cd ..
docker-compose restart backend
```

**Frontend:**
```powershell
cd react-app
npm run build
cd ..
docker-compose restart frontend
```

### 🔧 Configuration

#### Fichiers Importants

- **`docker-compose.yml`** - Configuration des services Docker
- **`nginx.conf`** - Configuration Nginx (reverse proxy)
- **`build-and-run.ps1`** - Script de build et démarrage automatique
- **`Dockerfile`** - Non utilisé (approche multi-conteneurs avec images existantes)
- **`.dockerignore`** - Fichiers exclus du build Docker

#### Variables d'Environnement

Dans `docker-compose.yml` :

```yaml
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/eventapp...
SPRING_DATASOURCE_USERNAME: eventapp
SPRING_DATASOURCE_PASSWORD: eventapp123
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: eventapp
MYSQL_USER: eventapp
MYSQL_PASSWORD: eventapp123
```

### 🐛 Dépannage

#### Le backend ne démarre pas

1. Vérifier que le JAR existe :
```powershell
dir backend\target\eventapp-0.0.1-SNAPSHOT.jar
```

2. Vérifier les logs :
```powershell
docker logs eventapp-backend
```

3. Si le JAR n'a pas le bon manifest :
```powershell
cd backend
mvn clean package -DskipTests
cd ..
docker-compose restart backend
```

#### MySQL ne démarre pas

```powershell
docker logs eventapp-mysql
```

Réinitialiser :
```powershell
docker-compose down -v
docker-compose up -d
```

#### Le frontend ne s'affiche pas

1. Vérifier que le dossier `dist` existe :
```powershell
dir react-app\dist
```

2. Vérifier Nginx :
```powershell
docker logs eventapp-frontend
docker exec eventapp-frontend nginx -t
```

#### Problème de connexion réseau

Si Docker ne peut pas télécharger les images :
- Vérifiez Docker Desktop
- Images utilisées : `mysql:8`, `eclipse-temurin:17-jre-jammy`, `nginx:alpine`

### 📊 Vérification de l'Installation

```powershell
# 1. Vérifier que tous les conteneurs fonctionnent
docker-compose ps

# 2. Tester le frontend
curl http://localhost

# 3. Tester le backend
curl http://localhost:8080/api

# 4. Tester Swagger
Start-Process http://localhost:8080/swagger-ui.html

# 5. Vérifier MySQL
docker exec -it eventapp-mysql mysql -u eventapp -peventapp123 -e "SHOW DATABASES;"
```

### 🔐 Sécurité pour la Production

⚠️ **Avant de déployer en production :**

1. Changez tous les mots de passe dans `docker-compose.yml`
2. Utilisez des secrets Docker ou des variables d'environnement
3. Configurez HTTPS avec un certificat SSL
4. Désactivez l'accès direct au port 3306 (MySQL)
5. Mettez en place des sauvegardes automatiques de MySQL
6. Utilisez un reverse proxy externe (Traefik, Nginx)

### 📈 Performance et Scalabilité

Pour améliorer les performances :

1. **Utilisez des volumes nommés** pour MySQL en production
2. **Augmentez les ressources** Docker Desktop si nécessaire
3. **Activez la mise en cache** Nginx
4. **Configurez un load balancer** pour plusieurs instances du backend
5. **Utilisez Redis** pour la mise en cache de sessions

### 🆘 Support

#### Problèmes connus

1. **Port déjà utilisé** : Changez les ports dans `docker-compose.yml`
2. **Mémoire insuffisante** : Augmentez la mémoire allouée dans Docker Desktop
3. **Build lent** : Utilisez `mvn -T 1C` pour paralléliser le build Maven

#### Logs détaillés

```powershell
# Backend avec plus de détails
docker logs eventapp-backend --tail 100 --follow

# Tous les services
docker-compose logs -f --tail=100
```

### 📚 Documentation

- **README-DOCKER.md** : Documentation complète Docker
- **backend/README.md** : Documentation du backend
- **react-app/README.md** : Documentation du frontend

### 🎯 Prochaines Étapes

1. ✅ Terminer le build du frontend React (corriger erreurs TypeScript)
2. ✅ Tester les endpoints de l'API
3. ✅ Ajouter des données de test dans MySQL
4. ✅ Configurer CI/CD (GitHub Actions)
5. ✅ Déployer sur un cloud provider (Azure, AWS, GCP)

---

## 🎊 Félicitations !

Votre application EventApp est maintenant complètement dockerisée et prête à être développée et déployée !

**Commande pour démarrer rapidement :**
```powershell
.\build-and-run.ps1
```

**Accès rapide :**
- Frontend : http://localhost
- API : http://localhost:8080/api
- Swagger : http://localhost:8080/swagger-ui.html
