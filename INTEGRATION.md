# Configuration Frontend-Backend

## Services créés

### 1. `api.ts` - Service API centralisé
Instance Axios configurée avec :
- **BaseURL** : `/api` (proxy Vite vers `http://localhost:8090`)
- **Intercepteur de requête** : Ajoute automatiquement le token JWT dans les headers
- **Intercepteur de réponse** : Gère les erreurs 401 (déconnexion automatique)

### 2. `authService.ts` - Service d'authentification
Fonctions disponibles :
- `register(data: RegisterData)` : Inscription (email, password)
- `login(data: LoginData)` : Connexion (retourne token, id, email, role)
- `forgotPassword(data)` : Mot de passe oublié
- `isAuthenticated()` : Vérifie si l'utilisateur est connecté
- `getUserRole()` : Récupère le rôle de l'utilisateur
- `logout()` : Déconnecte l'utilisateur

### 3. `eventService.ts` - Service de gestion des événements
Fonctions disponibles :
- `createEvent(event: Event)` : Créer un événement
- `updateEvent(id, event)` : Mettre à jour un événement
- `deleteEvent(id)` : Supprimer un événement
- `getEvent(id)` : Récupérer un événement par ID
- `searchEvents(params?)` : Rechercher des événements avec filtres
- `getAllEvents()` : Récupérer tous les événements

### 4. `reservationService.ts` - Service de gestion des réservations
Fonctions disponibles :
- `reserveEvent(eventId)` : Créer une réservation
- `initiatePayment(reservationId, paymentRequest?)` : Initier un paiement
- `confirmPayment(reservationId, paymentIntentId)` : Confirmer un paiement

## Configuration Backend

Le backend Spring Boot écoute sur le port **8090** avec les endpoints suivants :

### Endpoints d'authentification (public)
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion

### Endpoints d'événements (authentifié)
- `GET /api/events` : Liste des événements (avec filtres optionnels)
- `GET /api/events/{id}` : Détails d'un événement
- `POST /api/events` : Créer un événement
- `PUT /api/events/{id}` : Modifier un événement
- `DELETE /api/events/{id}` : Supprimer un événement

### Endpoints de réservations (authentifié)
- `POST /api/reservations/event/{eventId}` : Créer une réservation
- `POST /api/reservations/{id}/pay` : Initier un paiement
- `GET /api/reservations/{id}/confirm` : Confirmer un paiement

## Configuration CORS

Le backend autorise les requêtes depuis `http://localhost:5173` (Vite dev server).

## Démarrage

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd react-app
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Variables d'environnement

Créez un fichier `.env` à la racine de `react-app` :
```
VITE_API_BASE_URL=http://localhost:8090
```

## Authentification

Après connexion, le token JWT est stocké dans `localStorage` et automatiquement ajouté à toutes les requêtes API.

En cas d'erreur 401 (token expiré ou invalide), l'utilisateur est automatiquement redirigé vers `/login`.

## Modifications apportées

1. ✅ Création de `api.ts` avec intercepteurs Axios
2. ✅ Refonte de `authService.ts` avec types TypeScript
3. ✅ Création de `eventService.ts` complet
4. ✅ Création de `reservationService.ts` complet
5. ✅ Correction de `Register.tsx` (suppression du champ fullName)
6. ✅ Amélioration de `Login.tsx` avec gestion d'erreurs
7. ✅ Mise à jour de `Navbar.tsx` avec fonction logout
