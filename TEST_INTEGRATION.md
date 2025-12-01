# Comment tester l'intégration Frontend-Backend

## ✅ Le backend est bien configuré et fonctionne

### Endpoints disponibles

#### 1. **Page d'accueil de l'API** (Public)
```
http://localhost:8090/
```
Retourne:
```json
{
  "status": "OK",
  "message": "Event App API is running",
  "version": "1.0.0"
}
```

#### 2. **Health check** (Public)
```
http://localhost:8090/api/health
```
Retourne:
```json
{
  "status": "UP",
  "timestamp": "2025-11-18T19:45:00"
}
```

#### 3. **Inscription** (Public)
```bash
POST http://localhost:8090/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 4. **Connexion** (Public)
```bash
POST http://localhost:8090/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Retourne:
```json
{
  "id": 1,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "test@example.com",
  "role": "ROLE_USER"
}
```

## 🚀 Démarrage

### 1. Démarrer le backend
Dans un terminal PowerShell:
```powershell
cd C:\Users\admin\ge\event\backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
mvn spring-boot:run
```

Attendez de voir:
```
Tomcat started on port 8090 (http) with context path ''
Started EventAppApplication in X seconds
```

### 2. Tester le backend
Ouvrez votre navigateur et allez sur:
```
http://localhost:8090/
```

Vous devriez voir:
```json
{"status":"OK","message":"Event App API is running","version":"1.0.0"}
```

### 3. Démarrer le frontend
Dans un NOUVEAU terminal PowerShell:
```powershell
cd C:\Users\admin\ge\event\react-app
npm run dev
```

### 4. Accéder à l'application
Ouvrez votre navigateur sur:
```
http://localhost:5173
```

## 🎯 Test complet de l'intégration

### 1. S'inscrire
- Allez sur `http://localhost:5173/register`
- Entrez un email et un mot de passe
- Cliquez sur "S'inscrire"
- Vous devriez être redirigé vers `/login`

### 2. Se connecter
- Allez sur `http://localhost:5173/login`
- Entrez les mêmes identifiants
- Cliquez sur "Se connecter"
- Vous devriez être redirigé vers `/` (page d'accueil)

### 3. Vérifier que l'authentification fonctionne
Ouvrez la console du navigateur (F12) et tapez:
```javascript
localStorage.getItem('token')
localStorage.getItem('email')
localStorage.getItem('role')
```

Vous devriez voir vos informations stockées.

## 🔧 Résolution de problèmes

### Le backend ne démarre pas
- Vérifiez que MySQL est démarré
- Vérifiez que le port 8090 est libre
- Vérifiez que JAVA_HOME pointe vers JDK 17

### Erreur 403 sur localhost:8090
- C'est normal ! `localhost:8090` seul n'a plus de page d'accueil
- Utilisez `http://localhost:8090/` ou `http://localhost:8090/api/health`

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur le port 8090
- Vérifiez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que le proxy Vite est configuré dans `vite.config.ts`

## ✨ Architecture

```
┌─────────────────┐           ┌──────────────────┐
│  React Frontend │  Proxy    │  Spring Backend  │
│  localhost:5173 │◄─────────►│  localhost:8090  │
└─────────────────┘  /api/*   └──────────────────┘
```

Le frontend envoie les requêtes à `/api/*` qui sont automatiquement redirigées vers `http://localhost:8090/api/*` par le proxy Vite.

Toutes les requêtes incluent automatiquement le token JWT grâce à l'intercepteur Axios configuré dans `api.ts`.
