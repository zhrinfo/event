# Documentation Docker - EventApp

## Architecture

Cette application utilise Docker pour conteneuriser les trois composants principaux dans **des conteneurs séparés** :
- **MySQL** : Base de données (port 3306)
- **Spring Boot Backend** : API REST (port 8080)
- **React Frontend** : Application web servie par Nginx (port 80)

Tous les services communiquent via un réseau Docker dédié `eventapp-network`.

## Prérequis

- Docker Desktop installé et démarré
- Maven installé (pour build local du backend)
- Node.js et npm installés (pour build local du frontend)

## 🚀 Démarrage rapide

### Option 1: Script automatique (Recommandé)

```powershell
.\build-and-run.ps1
```

Ce script va :
1. Builder le backend Spring Boot
2. Builder le frontend React
3. Démarrer tous les conteneurs Docker

### Option 2: Étapes manuelles

#### 1. Build du Backend

```powershell
cd backend
mvn clean package spring-boot:repackage -DskipTests
cd ..
```

#### 2. Build du Frontend (optionnel)

```powershell
cd react-app
npm install
npm run build
cd ..
```

#### 3. Démarrer Docker

```powershell
docker-compose up -d
```

## 🌐 Accès à l'application

- **Frontend React** : http://localhost
- **Backend API** : http://localhost:8080/api
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **API Docs** : http://localhost:8080/api-docs
- **MySQL** : localhost:3306
  - Base de données: `eventapp`
  - Utilisateur: `eventapp`
  - Mot de passe: `eventapp123`

## 📋 Commandes Docker utiles

### Voir les conteneurs en cours d'exécution

```powershell
docker-compose ps
```

### Voir les logs

```powershell
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Redémarrer les services

```powershell
# Tous les services
docker-compose restart

# Service spécifique
docker-compose restart backend
```

### Arrêter l'application

```powershell
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ Supprime les données MySQL)

```powershell
docker-compose down -v
```

### Reconstruire après des modifications

```powershell
# Backend
cd backend
mvn clean package spring-boot:repackage -DskipTests
cd ..
docker-compose restart backend

# Frontend
cd react-app
npm run build
cd ..
docker-compose restart frontend
```

## 🔧 Dépannage

### Le backend ne démarre pas

1. Vérifiez que le JAR a été correctement construit :
```powershell
dir backend\target\eventapp-0.0.1-SNAPSHOT.jar
```

2. Vérifiez les logs :
```powershell
docker logs eventapp-backend
```

3. Si erreur "no main manifest attribute", reconstruisez avec :
```powershell
cd backend
mvn clean package spring-boot:repackage -DskipTests
cd ..
docker-compose restart backend
```

### MySQL ne démarre pas

```powershell
docker logs eventapp-mysql
```

Si nécessaire, supprimez les volumes et recréez :
```powershell
docker-compose down -v
docker-compose up -d
```

### Le frontend ne s'affiche pas

1. Vérifiez que le dossier `dist` existe :
```powershell
dir react-app\dist
```

2. Vérifiez les logs nginx :
```powershell
docker logs eventapp-frontend
```

### Problème de connexion réseau Docker

Si Docker ne peut pas télécharger les images :
- Vérifiez votre connexion Internet
- Vérifiez les paramètres proxy de Docker Desktop
- Les images nécessaires : `mysql:8`, `eclipse-temurin:17-jre-jammy`, `nginx:alpine`

## 📁 Structure des fichiers Docker

```
.
├── docker-compose.yml          # Configuration des services
├── nginx.conf                  # Configuration Nginx pour le frontend
├── build-and-run.ps1          # Script de build et démarrage automatique
├── backend/
│   └── target/
│       └── eventapp-0.0.1-SNAPSHOT.jar  # JAR Spring Boot
└── react-app/
    └── dist/                   # Build du frontend React
```

## 🔄 Workflow de développement

### 1. Développement local normal (sans Docker)

```powershell
# Backend
cd backend
mvn spring-boot:run

# Frontend (dans un autre terminal)
cd react-app
npm run dev
```

### 2. Test en environnement Docker

```powershell
.\build-and-run.ps1
```

### 3. Modifications et redéploiement

Après modification du code :

**Backend :**
```powershell
cd backend
mvn clean package spring-boot:repackage -DskipTests
cd ..
docker-compose restart backend
```

**Frontend :**
```powershell
cd react-app
npm run build
cd ..
docker-compose restart frontend
```

## 🔐 Configuration de sécurité

⚠️ **Pour la production :**

1. Modifiez les mots de passe MySQL dans `docker-compose.yml`
2. Changez la clé JWT dans `backend/src/main/resources/application.properties`
3. Utilisez des variables d'environnement ou des secrets Docker
4. Configurez un reverse proxy (Traefik, Nginx externe) avec HTTPS
5. Désactivez l'accès direct au port 3306 MySQL

## 📊 Monitoring

### Vérifier la santé des conteneurs

```powershell
docker-compose ps
docker stats
```

### Accéder à la base de données

```powershell
docker exec -it eventapp-mysql mysql -u eventapp -peventapp123 eventapp
```

### Vérifier l'API Backend

```powershell
curl http://localhost:8080/api/actuator/health
```

## 🚀 Déploiement en production

Pour la production, considérez :

1. **Docker Swarm ou Kubernetes** pour l'orchestration
2. **Volumes persistants** pour MySQL (pas des volumes Docker locaux)
3. **Reverse proxy avec SSL** (Let's Encrypt)
4. **CI/CD Pipeline** pour automatiser le build et le déploiement
5. **Monitoring** avec Prometheus/Grafana
6. **Sauvegardes automatiques** de la base de données
7. **Logs centralisés** (ELK Stack, Loki)

## ❓ Support

### Problèmes courants

1. **Port déjà utilisé** : Changez les ports dans `docker-compose.yml`
2. **Mémoire insuffisante** : Augmentez la mémoire allouée à Docker Desktop
3. **Erreurs de permission** : Exécutez Docker Desktop en administrateur

### Logs et debugging

```powershell
# Voir tous les logs
docker-compose logs -f

# Mode verbose
docker-compose --verbose up
```

---

## 📝 Notes

- Les données MySQL sont persistées dans un volume Docker nommé `event_mysql-data`
- Le backend attend que MySQL soit "healthy" avant de démarrer
- Nginx fait du reverse proxy des requêtes `/api` vers le backend
- Tous les services communiquent via le réseau `eventapp-network`
