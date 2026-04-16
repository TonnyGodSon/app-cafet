# ⚡ DÉMARRAGE RAPIDE - CHECKLIST IMPRIMABLE

## 📋 Avant de Commencer

```
☐ Java 17+ installé          java -version
☐ Node 18+ installé          node --version
☐ Maven installé             mvn --version
☐ npm installé               npm --version
☐ 2 terminaux ouverts
☐ Navigateur web ouvert
```

---

## 🚀 ÉTAPE 1: Démarrer le Backend (Terminal 1)

```bash
☐ cd C:\Users\Antoine\app-cafet\cafeteria-backend
☐ mvn spring-boot:run

⏳ Attendez ce message:
   "Tomcat started on port(s): 8080"
```

**Logs attendus**:
```
✓ Initializing default users...
✓ Tomcat started on port(s): 8080 (http)
✓ Application started successfully
```

---

## 🚀 ÉTAPE 2: Démarrer le Frontend (Terminal 2)

```bash
☐ cd C:\Users\Antoine\app-cafet\cafeteria-app
☐ npm start

⏳ Attendez notification:
   "Compiled successfully"
   + navigateur ouvre automatiquement
```

**Logs attendus**:
```
✓ ✔ Application bundle generated successfully
✓ ✔ Compiled successfully
✓ ⓘ Compiled successfully - 3 files in X seconds
```

---

## 🌐 ÉTAPE 3: Accéder à l'Application

```
☐ Navigateur s'ouvre à http://localhost:4200
☐ Voir formulaire de LOGIN
☐ Entrer:
   - Prénom: Mistura
   - Téléphone: 0758297734
☐ Cliquer CONNEXION
```

**Résultat attendu**:
```
✓ Redirection vers écran "Rejoindre ou Créer une Vente"
```

---

## 🛒 ÉTAPE 4: Tester Créer Vente

```
☐ Cliquer "Créer une Vente"
☐ Voir formulaire avec 11 produits:
   ✓ 3 PLATS (Thiéboudienne, Yassa, Mafé)
   ✓ 5 BOISSONS (Bissap, Ginger, Café, Thé, Eau)
   ✓ 3 DESSERTS (Yégué, Degue, Froyo)
☐ Cliquer "Créer"
☐ Voir CODE généré (exemple: 5847)
```

**Résultat attendu**:
```
✓ Code 4-chiffres aléatoire généré
✓ Affichage des produits disponibles
```

---

## 🛍️ ÉTAPE 5: Passer une Commande

```
☐ Cliquer "Ajouter" sur un produit
  (exemple: Thiéboudienne)
☐ Voir article dans le PANIER
☐ Saisir NOM DU CLIENT (ex: Client 1)
☐ Sélectionner MODE PAIEMENT (CASH ou CARD)
☐ Cliquer "PASSER COMMANDE"
☐ Voir message de succès
```

**Résultat attendu**:
```
✓ Commande créée
✓ Article disparaît du formulaire
✓ Message "Commande validée"
```

---

## 👥 ÉTAPE 6: Autre Client Rejoint

```
☐ Cliquer "Rejoindre une Vente Existante"
☐ Entrer CODE (ex: 5847 du code généré)
☐ Cliquer REJOINDRE
☐ Voir les mêmes produits
☐ Passer une AUTRE COMMANDE
☐ Saisir NOM DIFFÉRENT
☐ PASSER COMMANDE
```

**Résultat attendu**:
```
✓ Même vente, 2e client peut rejoindre
✓ 2 commandes créées
```

---

## 🏁 ÉTAPE 7: Fermer la Vente

```
☐ Cliquer "Fermer la Vente"
☐ Confirmer fermeture
☐ Voir RÉSUMÉ:
   ✓ Nombre de commandes (2)
   ✓ Montant total
   ✓ Status: CLOSED
```

**Résultat attendu**:
```
✓ Vente fermée
✓ Résumé avec statistiques
✓ Interface PDF/Email (mocked pour maintenant)
```

---

## 🔍 ÉTAPE 8: Vérifier DevTools

```
☐ Ouvrir DevTools: F12
☐ Onglet NETWORK
☐ Voir les requêtes HTTP:
   ✓ POST /api/auth/login → 200 OK
   ✓ POST /api/sales → 201 CREATED
   ✓ POST /api/orders → 201 CREATED
   ✓ GET /api/orders/sale/... → 200 OK
   ✓ PUT /api/sales/.../close → 200 OK
```

**Résultat attendu**:
```
✓ Toutes les requêtes réussies (codes 200/201)
✓ Responses sont au format JSON complet
```

---

## ✅ CHECKLIST DE VALIDATION FINALE

### Backend
```
☐ Backend démarre sans erreur
☐ "Tomcat started on port(s): 8080" visible
☐ H2 database initialisée
☐ 3 utilisateurs créés
```

### Frontend
```
☐ Frontend se compile sans erreur
☐ Navigateur ouvre automatiquement
☐ Page de login s'affiche
☐ Formulaire accepte les inputs
```

### API Communication
```
☐ Login réussit (redirection)
☐ Vente créée (code généré)
☐ Code 4-chiffres en format valide
☐ Commandes créées (succès)
```

### HTTP Requests
```
☐ POST /api/auth/login → 200 ✓
☐ GET /api/sales/... → 200 ✓
☐ POST /api/sales → 201 ✓
☐ POST /api/orders → 201 ✓
☐ PUT /api/sales/.../close → 200 ✓
```

### User Experience
```
☐ Redirection automatique après login
☐ Interface intuitive et claire
☐ Messages d'erreur lisibles
☐ Flux utilisateur logique
```

---

## 🐛 SI QUELQUE CHOSE NE FONCTIONNE PAS

### Erreur: "Cannot connect to localhost:8080"
```
☐ Vérifier que Terminal 1 affiche "Tomcat started"
☐ Attendre quelques secondes
☐ Recharger la page (Ctrl+R)
```

### Erreur: "CORS error origin not allowed"
```
☐ Vérifier que vous allez sur http://localhost:4200
☐ Vérifier que backend tourne sur 8080
☐ Redémarrer le backend
```

### Erreur: "POST /api/sales 404"
```
☐ Vérifier que Backend démarre sans erreur
☐ Voir logs backend pour voir les erreurs
☐ Redémarrer : Ctrl+C puis mvn spring-boot:run
```

### Erreur: "Cannot find module"
```
☐ Terminal Frontend: Ctrl+C (stopper)
☐ Exécuter: npm install
☐ Exécuter: npm start
```

---

## 🎯 RÉSULTAT ATTENDU FINAL

```
✅ Écran 1: Login affichée
✅ Écran 2: Join/Create visible après login
✅ Écran 3: Formulaire création vente fonctionne
✅ Écran 4: Code 4-chiffres généré
✅ Écran 5: Produits affichés
✅ Écran 6: Panier fonctionne
✅ Écran 7: Commande créée
✅ Écran 8: Vente fermée
✅ DevTools: Tous les endpoints affichent 200/201
```

---

## 🎊 SUCCÈS!

Si vous voyez tout cela:
```
✅ Frontend responsive et fluide
✅ Backend répond aux requêtes
✅ API endpoints tous à 200/201
✅ Données persisted correctement
✅ Flux utilisateur complet fonctionnel
```

**ALORS VOUS ÊTES BON! 🚀**

---

## 📞 BESOIN D'AIDE?

```
Si erreur → Voir QUICK_TEST.md - Troubleshooting
Si question API → Voir API_DOCUMENTATION.md
Si architecture → Voir ARCHITECTURE.md
Si navigation → Voir INDEX.md
```

---

## ⏱️ Temps Estimé

```
Démarrage Backend:    2-3 min
Démarrage Frontend:   1-2 min
Test complet:         5-10 min
─────────────────────────
TOTAL:               8-15 min
```

---

## 📊 Signaux de Succès

### Terminal 1 (Backend)
```
2024-01-15 10:00:00 INFO: Initializing default users...
2024-01-15 10:00:00 INFO: Tomcat started on port(s): 8080
2024-01-15 10:00:00 INFO: Application started successfully
2024-01-15 10:00:05 DEBUG: POST /api/auth/login received
2024-01-15 10:00:05 INFO: User found. Response: 200 OK
```

### Terminal 2 (Frontend)
```
✔ Application bundle generated successfully
✔ Compiled successfully
✔ Application is running on http://localhost:4200
```

### Navigateur
```
[Angular App Loaded]
[NgRx Store Initialized]
[HttpClient Ready]
[Form Displayed]
[HTTP Requests Successful]
```

---

## 🎁 Bonus: Test Rapide avec cURL

```bash
# Test 1: Login
curl -X POST "http://localhost:8080/api/auth/login?firstName=Mistura&phoneNumber=0758297734"

# Test 2: Get Users
curl "http://localhost:8080/api/auth/users"

# Test 3: Create Sale (optionnel - UI le fait)
curl -X POST "http://localhost:8080/api/sales" \
  -H "Content-Type: application/json" \
  -d '{"sellerName":"Mistura","saleDate":"2024-01-15", ... }'
```

---

**BONNE CHANCE! 🚀**

Pour guide complet: **[README.md](README.md)**
