# Guide de Connexion Frontend-Backend

## Configuration Terminée ✅

Le frontend Angular est maintenant entièrement configuré pour communiquer avec le backend Spring Boot.

## Points Clés de l'Intégration

### 1. Services Modifiés
Tous les services ont été mis à jour pour utiliser `HttpClient`:
- ✅ `AuthService` - Appels HTTP pour l'authentification
- ✅ `SaleService` - CRUD sur les ventes
- ✅ `OrderService` - Gestion des commandes

### 2. Configuration Angular
- ✅ `provideHttpClient()` ajouté dans `app.config.ts`
- ✅ CORS automatiquement géré par le backend
- ✅ URL de base du backend: `http://localhost:8080/api`

### 3. NgRx Effects
Les effects sont préalablement configurés pour dispatching d'actions et gestion des réponses HTTP.

---

## 🚀 Pour Démarrer

### Terminal 1 - Backend
```bash
cd cafeteria-backend
mvn clean install
mvn spring-boot:run
```
Attendez le message: "Tomcat started on port(s): 8080"

### Terminal 2 - Frontend  
```bash
cd cafeteria-app
npm install
npm start
```
Le navigateur s'ouvrira automatiquement sur `http://localhost:4200`

---

## 🧪 Test Rapide

1. Ouvrir http://localhost:4200
2. Connexion: Mistura / 0758297734
3. Créer une vente
4. Passer une commande
5. Vérifier les logs du backend

---

## 🛠️ Dépannage

### Erreur CORS?
- ✅ Backend a `@CrossOrigin(origins = "http://localhost:4200")`
- Vérifier que le backend tourne sur le port 8080

### Erreur 404 sur les appels API?
- Vérifier l'URL: `http://localhost:8080/api/auth/login`
- Vérifier les logs du backend

### Port 8080 déjà utilisé?
```bash
# Modifier src/main/resources/application.properties
server.port=8081
```

---

## 📊 Flux de Données

```
Frontend (Angular)
    ↓ HTTP Request
Backend (Spring Boot)
    ↓ JPA Query
H2 Database (In-Memory)
    ↓ Response
Frontend (Angular)
    ↓ NgRx Store Update
UI Update
```

---

## 📞 Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | Authentification utilisateur |
| GET | /api/auth/users | Lister les utilisateurs |
| POST | /api/sales | Créer une vente |
| GET | /api/sales/{code} | Récupérer une vente |
| PUT | /api/sales/{code}/close | Fermer une vente |
| POST | /api/orders | Créer une commande |
| GET | /api/orders/sale/{code} | Lister les commandes |

---

## 🎯 Étapes Suivantes

1. ✅ Tester le flux complet
2. ⬜ Ajouter JWT pour la sécurité
3. ⬜ Implémenter la génération PDF
4. ⬜ Ajouter l'envoi d'emails
5. ⬜ Migrer vers une vraie base de données
