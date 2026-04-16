# 📡 Documentation Complète des Endpoints API

## Base URL: `http://localhost:8080/api`

---

## 🔐 Authentication Endpoints

### 1. **Login User**
**POST** `/auth/login`

Authentifie un utilisateur avec son nom et numéro de téléphone.

#### Paramètres (Query)
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| firstName | string | ✅ | Prénom de l'utilisateur |
| phoneNumber | string | ✅ | Numéro de téléphone |

#### Exemple de Requête
```
POST /api/auth/login?firstName=Mistura&phoneNumber=0758297734
Content-Type: application/json
```

#### Réponse Success (200)
```json
{
  "id": 1,
  "firstName": "Mistura",
  "phoneNumber": "0758297734"
}
```

#### Réponse Error (401/404)
```json
{
  "message": "User not found",
  "status": 404
}
```

---

### 2. **Get All Users**
**GET** `/auth/users`

Récupère la liste complète des utilisateurs.

#### Paramètres
Aucun

#### Exemple de Requête
```
GET /api/auth/users
Content-Type: application/json
```

#### Réponse Success (200)
```json
[
  { "id": 1, "firstName": "Mistura", "phoneNumber": "0758297734" },
  { "id": 2, "firstName": "Kaissy", "phoneNumber": "0780862724" },
  { "id": 3, "firstName": "Antoine", "phoneNumber": "0767292866" }
]
```

---

## 🛒 Sale Endpoints

### 3. **Create Sale**
**POST** `/sales`

Crée une nouvelle vente avec ses produits associés.

#### Body (JSON)
```json
{
  "sellerName": "Mistura",
  "saleDate": "2024-01-15",
  "dishes": [
    { "name": "Thiéboudienne", "price": 3000 },
    { "name": "Yassa Poisson", "price": 2500 }
  ],
  "drinks": [
    { "name": "Bissap", "price": 500 },
    { "name": "Ginger Juice", "price": 600 }
  ],
  "desserts": [
    { "name": "Yégué", "price": 800 },
    { "name": "Degue", "price": 700 }
  ]
}
```

#### Réponse Success (201)
```json
{
  "code": "5847",
  "sellerName": "Mistura",
  "saleDate": "2024-01-15",
  "status": "OPEN",
  "items": [
    {
      "id": 1,
      "category": "DISH",
      "name": "Thiéboudienne",
      "price": 3000
    }
  ]
}
```

---

### 4. **Get Sale by Code**
**GET** `/sales/{code}`

Récupère les détails d'une vente par son code 4-chiffres.

#### Paramètres (Path)
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| code | string | ✅ | Code 4-chiffres de la vente |

#### Exemple de Requête
```
GET /api/sales/5847
Content-Type: application/json
```

#### Réponse Success (200)
```json
{
  "code": "5847",
  "sellerName": "Mistura",
  "saleDate": "2024-01-15",
  "status": "OPEN",
  "createdAt": "2024-01-15T10:00:00Z",
  "items": [ ... ],
  "orders": [ ... ]
}
```

#### Réponse Error (404)
```json
{
  "message": "Sale not found",
  "status": 404
}
```

---

### 5. **Close Sale**
**PUT** `/sales/{code}/close`

Ferme une vente et la marque comme complétée.

#### Paramètres (Path)
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| code | string | ✅ | Code 4-chiffres de la vente |

#### Exemple de Requête
```
PUT /api/sales/5847/close
Content-Type: application/json
```

#### Réponse Success (200)
```json
{
  "code": "5847",
  "sellerName": "Mistura",
  "saleDate": "2024-01-15",
  "status": "CLOSED",
  "totalOrders": 5,
  "totalAmount": 45000,
  "closedAt": "2024-01-15T12:30:00Z"
}
```

---

## 📦 Order Endpoints

### 6. **Create Order**
**POST** `/orders`

Crée une nouvelle commande pour une vente spécifique.

#### Body (JSON)
```json
{
  "saleCode": "5847",
  "buyerName": "Client 1",
  "items": [
    {
      "saleItemId": 1,
      "quantity": 2
    },
    {
      "saleItemId": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "CASH"
}
```

#### Réponse Success (201)
```json
{
  "id": 1,
  "saleCode": "5847",
  "buyerName": "Client 1",
  "status": "PENDING",
  "paymentMethod": "CASH",
  "totalAmount": 6500,
  "items": [
    {
      "id": 1,
      "name": "Thiéboudienne",
      "quantity": 2,
      "price": 3000,
      "subtotal": 6000
    }
  ],
  "createdAt": "2024-01-15T10:05:00Z"
}
```

---

### 7. **Get Orders by Sale Code**
**GET** `/orders/sale/{code}`

Récupère toutes les commandes d'une vente spécifique.

#### Paramètres (Path)
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| code | string | ✅ | Code 4-chiffres de la vente |

#### Exemple de Requête
```
GET /api/orders/sale/5847
Content-Type: application/json
```

#### Réponse Success (200)
```json
[
  {
    "id": 1,
    "saleCode": "5847",
    "buyerName": "Client 1",
    "status": "PENDING",
    "totalAmount": 6500,
    "items": [ ... ]
  },
  {
    "id": 2,
    "saleCode": "5847",
    "buyerName": "Client 2",
    "status": "PENDING",
    "totalAmount": 8200,
    "items": [ ... ]
  }
]
```

---

## 🗂️ Types de Données

### User
```typescript
{
  id: number;
  firstName: string;
  phoneNumber: string;
}
```

### Sale
```typescript
{
  code: string;          // Format: 4 chiffres aleatoires
  sellerName: string;
  saleDate: string;      // Format: YYYY-MM-DD
  status: "OPEN" | "CLOSED";
  items: SaleItem[];
  orders: Order[];
  createdAt: string;     // ISO format
  closedAt?: string;
}
```

### SaleItem
```typescript
{
  id: number;
  category: "DISH" | "DRINK" | "DESSERT";
  name: string;
  price: number;
}
```

### Order
```typescript
{
  id: number;
  saleCode: string;
  buyerName: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  paymentMethod: "CASH" | "CARD";
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}
```

### OrderItem
```typescript
{
  id: number;
  saleItemId: number;
  quantity: number;
  price: number;
  subtotal: number;
}
```

---

## 🧪 Curl Examples

### Login
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Mistura","phoneNumber":"0758297734"}'
```

### Create Sale
```bash
curl -X POST "http://localhost:8080/api/sales" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerName": "Mistura",
    "saleDate": "2024-01-15",
    "dishes": [{"name":"Thiéboudienne","price":3000}],
    "drinks": [{"name":"Bissap","price":500}],
    "desserts": [{"name":"Yégué","price":800}]
  }'
```

### Get Sale
```bash
curl -X GET "http://localhost:8080/api/sales/5847" \
  -H "Content-Type: application/json"
```

### Create Order
```bash
curl -X POST "http://localhost:8080/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "saleCode": "5847",
    "buyerName": "Client 1",
    "items": [{"saleItemId":1,"quantity":2}],
    "paymentMethod": "CASH"
  }'
```

### Get Orders
```bash
curl -X GET "http://localhost:8080/api/orders/sale/5847" \
  -H "Content-Type: application/json"
```

### Close Sale
```bash
curl -X PUT "http://localhost:8080/api/sales/5847/close" \
  -H "Content-Type: application/json"
```

---

## 🔥 Status Codes

| Code | Signification |
|------|---------------|
| 200 | ✅ SUCCESS - Requête réussie |
| 201 | ✅ CREATED - Ressource créée |
| 400 | ❌ BAD REQUEST - Données invalides |
| 401 | ❌ UNAUTHORIZED - Non authentifié |
| 404 | ❌ NOT FOUND - Ressource non trouvée |
| 500 | ❌ SERVER ERROR - Erreur serveur |

---

## 💾 Headers à Utiliser

```
Content-Type: application/json
Accept: application/json
Origin: http://localhost:4200  (automatique depuis Angular)
```

---

## 🔄 Flux Complet d'Utilisation

```
1. POST /auth/login
   ↓ Obtenir utilisateur
   ↓
2. POST /sales
   ↓ Créer vente, récupérer code (ex: 5847)
   ↓
3. GET /sales/5847
   ↓ Vérifier contenu de la vente
   ↓
4. POST /orders (multiple fois)
   ↓ Ajouter commandes
   ↓
5. GET /orders/sale/5847
   ↓ Lister toutes les commandes
   ↓
6. PUT /sales/5847/close
   ↓ Fermer la vente
```

---

**Version du Document**: 1.0
**Dernière Mise à Jour**: 2024-01-15
**Compatible Avec**: Spring Boot 3.1.0 + Angular 21.2.0
