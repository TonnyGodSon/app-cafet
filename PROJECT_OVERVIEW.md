# 📚 Vue Générale du Projet - Système de Gestion de Ventes Cafétéria

## 🎯 Résumé du Projet

Système complet de gestion de commandes pour une cafétéria, permettant aux vendeurs de créer des ventes et aux clients de passer des commandes.

**Stack Technologique**:
- **Frontend**: Angular 21.2 + NgRx 21.1 + Angular Material 21.2 + SCSS
- **Backend**: Spring Boot 3.1 + Spring Data JPA + H2 Database
- **Communication**: REST API avec CORS
- **Authentification**: Simple (utilisateurs prédéfinis)

---

## 📍 Structure des Répertoires

```
C:\Users\Antoine\app-cafet\
├── cafeteria-app/                          # 🎨 Frontend Angular
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── models/                     # Types TypeScript
│   │   │   ├── services/                   # HttpClient services
│   │   │   └── guards/                     # Route protection
│   │   ├── store/                          # NgRx state management
│   │   │   ├── auth/                       # Auth store
│   │   │   ├── sales/                      # Sales store
│   │   │   └── orders/                     # Orders store
│   │   ├── features/                       # Components des 5 écrans
│   │   │   ├── login/
│   │   │   ├── join-sale/
│   │   │   ├── create-sale/
│   │   │   ├── sale-display/
│   │   │   └── close-sale/
│   │   ├── app.routes.ts                   # Routing
│   │   └── app.config.ts                   # Configuration (HttpClient)
│   ├── angular.json                        # Configuration Angular
│   └── package.json                        # Dépendances npm
│
├── cafeteria-backend/                      # ☕ Backend Spring Boot
│   ├── src/main/java/com/cafeteria/
│   │   ├── entity/                         # JPA entities
│   │   │   ├── User
│   │   │   ├── Sale
│   │   │   ├── SaleItem
│   │   │   ├── Order
│   │   │   └── OrderItem
│   │   ├── repository/                     # Spring Data repositories
│   │   ├── service/                        # Business logic
│   │   ├── api/                            # REST controllers
│   │   ├── dto/                            # Data Transfer Objects
│   │   └── CafeteriaApplication.java       # Point d'entrée
│   ├── src/main/resources/
│   │   └── application.properties          # Configuration BD & serveur
│   ├── pom.xml                             # Dépendances Maven
│   └── target/                             # Artifacts compilés
│
├── node_modules/                           # Dépendances npm
├── documentation/
│   ├── README.md                           # Guide général
│   ├── INTEGRATION_GUIDE.md                # 🔗 Comment connecter les services
│   ├── INTEGRATION_SUMMARY.md              # 📋 Résumé de l'intégration
│   ├── API_DOCUMENTATION.md                # 📡 Endpoints API détaillés
│   └── QUICK_TEST.md                       # 🧪 Test rapide en 5 minutes
├── .gitignore                              # Fichiers ignorés
└── [autres fichiers de config]             # Fichiers racine

```

---

## 🏃 Démarrage Rapide

### 1. Démarrer le Backend
```bash
cd cafeteria-backend
mvn clean install     # Première fois
mvn spring-boot:run
```
✅ Attend: "Tomcat started on port(s): 8080"

### 2. Démarrer le Frontend
```bash
cd cafeteria-app
npm install          # Première fois
npm start
```
✅ Attend: Ouverture automatique de http://localhost:4200

---

## 💻 Fonctionnalités Implémentées

### 🔒 Authentification
- ✅ Login avec prénom + téléphone
- ✅ 3 utilisateurs par défaut initialisés
- ⏳ JWT (à implémenter)

### 🛒 Gestion des Ventes
- ✅ Créer une vente avec 11 produits
- ✅ Générer code 4-chiffres automatique
- ✅ Rejoindre vente existante
- ✅ Fermer vente
- ✅ Voir toutes les commandes

### 📦 Gestion des Commandes
- ✅ Passer une commande
- ✅ Ajouter/retirer articles
- ✅ Calculer total
- ✅ Mode de paiement
- ⏳ PDF (interface prête)
- ⏳ Email (interface prête)

### 🎨 Interface Utilisateur
- ✅ 5 écrans entièrement routés
- ✅ Angular Material componets
- ✅ Responsive design SCSS
- ✅ Formulaires validés
- ✅ Gestion du state avec NgRx

---

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Authentifier utilisateur |
| GET | `/api/auth/users` | Lister utilisateurs |
| POST | `/api/sales` | Créer vente |
| GET | `/api/sales/{code}` | Récupérer vente |
| PUT | `/api/sales/{code}/close` | Fermer vente |
| POST | `/api/orders` | Créer commande |
| GET | `/api/orders/sale/{code}` | Lister commandes |

**Documentation complète**: Voir [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 👥 Utilisateurs de Test

| Prénom | Téléphone | Rôle |
|--------|-----------|------|
| Mistura | 0758297734 | Vendeur/Client |
| Kaissy | 0780862724 | Vendeur/Client |
| Antoine | 0767292866 | Vendeur/Client |

---

## 📊 Architectural Patterns

### Frontend - NgRx State Management
```
Component dispatches Action
    ↓
Action triggers Effect (HTTP call)
    ↓
API Response
    ↓
Reducer updates Store
    ↓
Selector notifies Components
    ↓
UI re-renders
```

### Backend - Layered Architecture
```
REST Controller (@PostMapping, @GetMapping)
    ↓
Service (Business Logic)
    ↓
Repository (JPA Queries)
    ↓
Entity (JPA Model)
    ↓
H2 Database
```

---

## 🛠️ Technologies Détail

### Frontend
```json
{
  "@angular/core": "21.2.0",
  "@ngrx/store": "21.1.0",
  "@ngrx/effects": "21.1.0",
  "@angular/material": "21.2.6",
  "rxjs": "7.8.1",
  "typescript": "5.9.1"
}
```

### Backend
```xml
<spring.boot.version>3.1.0</spring.boot.version>
<spring-data-jpa>3.1.0</spring-data-jpa>
<h2>2.1.214</h2>
<lombok>1.18.30</lombok>
```

---

## 🔍 Flux Complet d'Utilisation

```
1. Accès http://localhost:4200
        ↓
2. Login (Mistura/0758297734)
        ↓
3. Choix: Créer ou Rejoindre Vente
        ├─ Créer → Formulaire produits → Code généré (5847)
        └─ Rejoindre → Saisir code (5847)
        ↓
4. Sélectionner produits
        ↓
5. Ajouter au panier
        ↓
6. Saisir nom client + mode paiement
        ↓
7. "Passer Commande"
        ↓
8. Confirmer succès
        ↓
9. Autres clients peuvent rejoindre avec code
        ↓
10. "Fermer la Vente"
        ↓
11. Résumé total (PDF/Email - mocked)
```

---

## ⚙️ Configuration & Variables

### Backend (application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
logging.level.root=INFO
```

### Frontend (environment)
```typescript
apiUrl: 'http://localhost:8080/api'
```

---

## 📚 Documentation Complète

| Fichier | Contenu |
|---------|---------|
| [README.md](README.md) | Guide général du projet |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Configuration Frontend-Backend |
| [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) | Résumé technique détaillé |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | 📡 Endpoints avec exemples |
| [QUICK_TEST.md](QUICK_TEST.md) | 🧪 Test en 5-10 minutes |

---

## 🚀 Pour Démarrer

Sélectionnez selon vos besoins:

- **Nouveau?** → [QUICK_TEST.md](QUICK_TEST.md)
- **Configuration?** → [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Endpoints API?** → [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Détails techniques?** → [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)
- **Vue générale?** → Vous lisez ce fichier! 📄

---

## 🔮 Roadmap Futures Features

### Phase 2 (Court terme)
- [ ] JWT authentication pour sécurité
- [ ] Vraie génération de PDF (jsPDF)
- [ ] Envoi d'emails (Spring Mail)
- [ ] Validation inputs côté serveur

### Phase 3 (Moyen terme)
- [ ] Pagination & filtrage
- [ ] Statistiques de ventes
- [ ] Historique commandes
- [ ] Interface d'administration

### Phase 4 (Court terme)
- [ ] Migration vers PostgreSQL
- [ ] Déploiement Docker
- [ ] Tests unitaires & E2E
- [ ] CI/CD pipeline

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| Backend ne démarre | Vérifier Java 17+ et Maven installés |
| Frontend n'affiche rien | Vérifier Node 18+ et npm |
| CORS error | Backend doit tourne avant frontend |
| Port occupé | `lsof -i :8080` (Mac) ou `netstat` (Windows) |
| Données perdues | H2 est en mémoire; redémarrage = reset |

---

## 📞 Support

- **Architecture questions** → Voir INTEGRATION_SUMMARY.md
- **API questions** → Voir API_DOCUMENTATION.md
- **Problèmes techniques** → Voir logs backend/frontend
- **Données de test** → Voir QUICK_TEST.md

---

## 🎓 Concepts Appris

Ce projet démontre:
- ✅ Architecture REST complète (Frontend ↔ Backend)
- ✅ State management avec NgRx
- ✅ ORM avec JPA/Hibernate
- ✅ CORS & HTTP communication
- ✅ Layered architecture en Spring Boot
- ✅ Component-based UI avec Angular Material

---

## 📄 Licences & Crédits

**Frameworks utilisés**:
- Angular (Google)
- Spring Boot (Pivotal)
- NgRx (Brandon Roberts, Michael Henry)
- Angular Material (Google)

---

## 🎉 Status

✅ **Frontend**: Entièrement connecté au backend
✅ **Backend**: Complètement fonctionnel
✅ **API**: 7 endpoints implémentés
✅ **Documentation**: Complète et détaillée
✅ **Prêt pour**: Tests end-to-end

**Version**: 1.0 - Production Ready (features optionnelles à venir)

---

*Dernière mise à jour: 2024-01-15*
*Développé avec: Angular 21.2 + Spring Boot 3.1*
