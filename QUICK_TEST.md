# 🚀 Guide de Test Rapide

## ⏱️ 5 Minutes pour Tester le Système Complet

Ce guide vous permet de tester rapidement toute l'application.

---

## 1️⃣ **Démarrer les Services**

### Terminal 1 - Backend (Laissez tourner)
```bash
cd cafeteria-backend
mvn spring-boot:run
```

Attendez ce message:
```
2024-01-XX 10:00:00.000  INFO  : Initializing default users...
2024-01-XX 10:00:00.100  INFO  : Tomcat started on port(s): 8080
```

### Terminal 2 - Frontend (Laissez tourner)
```bash
cd cafeteria-app
npm start
```

Attendez:
```
✔ Application bundle generated successfully.
✔ Compiled successfully.
Local: http://localhost:4200/
```

---

## 2️⃣ **Tester l'Application dans le Navigateur**

### 📱 Étape 1: Login
1. Ouvrir http://localhost:4200
2. Voir le formulaire de connexion
3. Entrer:
   - **Prénom**: `Mistura`
   - **Téléphone**: `0758297734`
4. Cliquer "Connexion"
5. ✅ Devrait se connecter et montrer "Rejoindre ou Créer une Vente"

### 🏪 Étape 2: Créer une Vente
1. Cliquer "Créer une Vente"
2. Voir le formulaire avec les produits (11 articles)
3. Vérifier les catégories:
   - Plats: Thiéboudienne, Yassa, Mafé
   - Boissons: Bissap, Ginger, Café, Thé, Eau
   - Desserts: Yégué, Degue, Froyo
4. Cliquer "Créer"
5. ✅ Devrait générer un **code 4-chiffres** (exemple: 5847)

### 🛒 Étape 3: Passer des Commandes
1. Regarder le code généré (ex: 5847)
2. Sélectionner des produits avec le bouton "Ajouter"
3. Voir les articles s'ajouter au panier
4. Entrer "Nom du Client"
5. Sélectionner "Mode de Paiement"
6. Cliquer "Passer Commande"
7. ✅ Voir le message de succès

### 🔍 Étape 4: Rejoindre avec un Autre Client
1. Cliquer "Rejoindre une Vente Existante"
2. Entrer le code de la vente (ex: 5847)
3. Cliquer "Rejoindre"
4. ✅ Voir les mêmes produits disponibles
5. Passer une autre commande

### 🏁 Étape 5: Fermer la Vente
1. Cliquer "Fermer la Vente"
2. Reconfirmer fermeture
3. ✅ Voir le résumé:
   - Nombre de commandes
   - Montant total
   - Status: CLOSED

---

## 🖥️ **Vérifier les Appels HTTP (Developer Tools)**

Ouvrir DevTools: `F12` ou `Ctrl+Shift+I`

### Onglet Network
1. Recharger la page (`F5`)
2. Cliquer sur "Connexion"
3. Voir les requêtes:
   ```
   POST http://localhost:8080/api/auth/login → 200 OK
   GET http://localhost:8080/api/auth/users → 200 OK
   ```

### Onglet Console
Voir les logs:
```
✓ HTTP Request to /api/auth/login
✓ Response received: {...}
✓ Action dispatched: auth/login/success
```

---

## 🔍 **Vérifier les Logs Backend**

Dans le Terminal 1 (Backend), vous devriez voir:

```log
2024-01-15 10:00:00.100  INFO  : POST /api/auth/login
2024-01-15 10:00:00.105  INFO  : Found user: Mistura (id=1)
2024-01-15 10:00:00.106  INFO  : Response: 200 OK
2024-01-15 10:00:00.200  INFO  : POST /api/sales
2024-01-15 10:00:00.210  INFO  : Sale created with code: 5847
2024-01-15 10:00:00.211  INFO  : Response: 201 CREATED
```

---

## 🧪 **Tester avec cURL (Terminal 3)**

### Test 1: Login
```bash
curl -X POST "http://localhost:8080/api/auth/login?firstName=Mistura&phoneNumber=0758297734"
```

Réponse attendue:
```json
{"id":1,"firstName":"Mistura","phoneNumber":"0758297734"}
```

### Test 2: Get Users
```bash
curl "http://localhost:8080/api/auth/users"
```

Réponse attendue:
```json
[
  {"id":1,"firstName":"Mistura","phoneNumber":"0758297734"},
  {"id":2,"firstName":"Kaissy","phoneNumber":"0780862724"},
  {"id":3,"firstName":"Antoine","phoneNumber":"0767292866"}
]
```

### Test 3: Create Sale (optionnel - UI le fait)
```bash
curl -X POST "http://localhost:8080/api/sales" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerName":"Mistura",
    "saleDate":"2024-01-15",
    "dishes":[{"name":"Thiéboudienne","price":3000}],
    "drinks":[{"name":"Bissap","price":500}],
    "desserts":[{"name":"Yégué","price":800}]
  }'
```

---

## ✅ **Checklist de Validation**

- [ ] Backend démarre sans erreur (port 8080)
- [ ] Frontend démarre sans erreur (port 4200)
- [ ] Login réussit avec "Mistura" / "0758297734"
- [ ] Code 4-chiffres généré
- [ ] Commandes ajoutées au panier
- [ ] Commande créée avec succès
- [ ] Plusieurs clients peuvent rejoindre avec le code
- [ ] Vente ferme et affiche le résumé
- [ ] DevTools affiche requêtes HTTP (Network)
- [ ] Logs backend affichent les requêtes

---

## 🐛 **Si Ça Ne Marche Pas**

### ❌ "Cannot connect to localhost:8080"
```bash
# Vérifier que le backend tourne
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Recommencer le backend
mvn spring-boot:run
```

### ❌ "CORS error"
- Vérifier que le backend répond sur `http://localhost:8080/api`
- Attendre le message "Tomcat started"

### ❌ "Cannot GET /api/..."
- Vérifier les logs du backend pour les erreurs 404
- Vérifier que les endpoints existent dans les controllers

### ❌ "ERR_CONNECTION_REFUSED"
- Attendre quelques secondes
- Vérifier les 2 terminaux tournent
- Recharger la page

---

## 📊 **Données de Test Alternatives**

Autres utilisateurs prédéfinis:

| Prénom | Téléphone | Pour Tester |
|--------|-----------|-------------|
| Kaissy | 0780862724 | Autres vendeurs |
| Antoine | 0767292866 | Autre client |

---

## 💡 **Tips Utiles**

1. **Garder les DevTools ouverts** pour voir les erreurs HTTP
2. **Garder les logs backends visibles** pour déboguer
3. **Tester avec 2-3 clients** dans la même vente
4. **Essayer de rejoindre avec mauvais code** pour voir l'erreur
5. **Fermer et rouvrir le navigateur** si problème

---

## 🎯 **À Faire Après le Test**

✅ Test réussi? Voici les prochaines étapes:

1. **Implémenter PDF réel** (remplacer mock dans CloseSaleComponent)
2. **Implémenter Email réel** (setup nodemailer ou Spring Mail)
3. **Ajouter JWT** pour sécuriser l'authentification
4. **Ajouter validation** des inputs
5. **Migrer vers PostgreSQL** pour production

---

**Durée Estimée**: ⏱️ 5-10 minutes
**Résultat Attendu**: Tous les tests verts ✅

Bon test! 🎉
