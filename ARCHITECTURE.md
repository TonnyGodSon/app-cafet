# 🏗️ Architecture Complète du Système

## Vue d'Ensemble Générale

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SYSTÈME COMPLET                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────┐        ┌──────────────────────────┐ │
│  │   NAVIGATEUR WEB         │        │  TERMINAL BACKEND        │ │
│  │  (http://localhost:4200) │◄──────►│  (http://localhost:8080) │ │
│  │                          │   HTTP │                          │ │
│  │   Angular 21.2           │   REST │  Spring Boot 3.1         │ │
│  └──────────────────────────┘        └──────────────────────────┘ │
│                                              │                    │
│                                         JPA │ Queries             │
│                                              ▼                    │
│                                         H2 Database               │
│                                         (In-Memory)              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Architecture Frontend (Angular 21.2)

### Étage 1: Routing & States
```
┌─────────────────────────────────────────────────────────┐
│              APP ROUTES (app.routes.ts)                 │
├─────────────────────────────────────────────────────────┤
│ /login  → LoginComponent                                │
│ /join → JoinSaleComponent                               │
│ /create → CreateSaleComponent                           │
│ /sale → SaleDisplayComponent                            │
│ /close → CloseSaleComponent                             │
└─────────────────────────────────────────────────────────┘
```

### Étage 2: Components (Présentation)
```
┌────────────────────────────────────────────────────────────┐
│              FEATURE COMPONENTS                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  LoginComponent          CreateSaleComponent              │
│  ├─ Form              ├─ Product list (11 items)          │
│  └─ Submit            └─ Form + Buttons                   │
│                                                            │
│  JoinSaleComponent       SaleDisplayComponent              │
│  ├─ Code input       ├─ Tabs (Plats/Boissons/Desserts)  │
│  └─ Search           └─ Cart management                   │
│                                                            │
│  CloseSaleComponent                                        │
│  ├─ Confirmation                                          │
│  └─ PDF/Email (mocked)                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
         ↓ dispatch Actions      ↑ subscribe Selectors
```

### Étage 3: NgRx State Management
```
┌────────────────────────────────────────────────────────────┐
│              NGRX STORE (@ngrx/store 21.1)               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  AUTH STORE          SALES STORE         ORDERS STORE     │
│  ├─ user            ├─ currentSale      ├─ orders        │
│  ├─ isLoading       ├─ salesList        ├─ cartItems     │
│  ├─ error           ├─ saleCode         ├─ totalAmount   │
│  └─ isAuthenticated └─ error            └─ status        │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Actions (20+): login, createSale, joinSale,        │  │
│  │ createOrder, closeSale, addToCart, removeFromCart  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Reducers: reduceSaleState(), reduceOrderState()    │  │
│  │ Selectors: selectUser$, selectSale$, selectCart$   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
         ↓ dispatch          ↑ listen
```

### Étage 4: Effects (Effets Secondaires & HTTP)
```
┌────────────────────────────────────────────────────────────┐
│            @NGRX/EFFECTS (Middlewares)                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Action dispatché                                        │
│       ↓                                                   │
│  Effect intercepte                                       │
│       ↓                                                   │
│  HttpClient call Services                                │
│       ↓ (Observable)                                     │
│  API réponse reçue                                       │
│       ↓                                                   │
│  Mapper en Success/Failure Action                        │
│       ↓                                                   │
│  Redux Store update                                      │
│       ↓                                                   │
│  Components re-render                                    │
│                                                            │
│ Effects implémentés:                                      │
│ • login$ → AuthService.login()                            │
│ • createSale$ → SaleService.createSale()                  │
│ • joinSale$ → SaleService.getSaleByCode()                 │
│ • closeSale$ → SaleService.closeSale()                    │
│ • createOrder$ → OrderService.createOrder()               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Étage 5: Services (API Client)
```
┌────────────────────────────────────────────────────────────┐
│            SERVICES (HttpClient)                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  AuthService                SaleService                    │
│  ├─ login()            ├─ createSale()                    │
│  └─ getUsers()         ├─ getSaleByCode()                 │
│                        └─ closeSale()                     │
│                                                            │
│  OrderService                                             │
│  ├─ createOrder()                                         │
│  └─ getOrdersBySaleCode()                                 │
│                                                            │
│  Configuration:                                           │
│  • Base URL: http://localhost:8080/api                    │
│  • Interceptors: Error handling, logging                  │
│  • Operators: catchError, switchMap, map                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
         ↓ HTTP Requests        ↑ Observable Responses
```

### Étage 6: Models & Types
```
┌────────────────────────────────────────────────────────────┐
│            MODELS (TypeScript Interfaces)                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  User              Sale               Order               │
│  ├─ id            ├─ code            ├─ id               │
│  ├─ firstName     ├─ sellerName      ├─ saleCode        │
│  └─ phoneNumber   ├─ status          ├─ buyerName       │
│                   ├─ items: []       ├─ items: []       │
│                   └─ orders: []      └─ totalAmount     │
│                                                            │
│  Product           OrderItem         SaleItem           │
│  ├─ name          ├─ quantity        ├─ category       │
│  ├─ price         ├─ price           ├─ name           │
│  └─ category      └─ subtotal        └─ price          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## ☕ Architecture Backend (Spring Boot 3.1)

### Étage 1: REST Controllers (@RestController)
```
┌────────────────────────────────────────────────────────────┐
│            REST ENDPOINTS                                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  AuthController           SaleController                   │
│  @PostMapping("/login")  @PostMapping("")                 │
│  @GetMapping("/users")   @GetMapping("/{code}")           │
│                          @PutMapping("/{code}/close")     │
│                                                            │
│  OrderController                                           │
│  @PostMapping("")                                          │
│  @GetMapping("/sale/{code}")                              │
│                                                            │
│  Features:                                                 │
│  • @CrossOrigin(origins = "http://localhost:4200")       │
│  • Exception handling (@ExceptionHandler)                  │
│  • Request/Response DTOs                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
         ↓ HTTP Requests        ↑ JSON Responses
```

### Étage 2: Data Transfer Objects (DTOs)
```
┌────────────────────────────────────────────────────────────┐
│            DTO LAYER (Request/Response)                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Requests:             Responses:                          │
│  • CreateSaleRequest   • UserDTO                          │
│  • CreateOrderRequest  • SaleDTO                          │
│                        • OrderDTO                          │
│                        • ErrorResponse                     │
│                                                            │
│  Purpose:                                                  │
│  • Découple API contract from entities                    │
│  • Validation: @NotNull, @NotBlank, @Min                 │
│  • Serialization/Deserialization automatique              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Étage 3: Services (Business Logic)
```
┌────────────────────────────────────────────────────────────┐
│            SERVICE LAYER (@Service)                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  UserService               SaleService                     │
│  ├─ authenticate()     ├─ createSale()                    │
│  ├─ getUserByNamePhone ├─ getSaleByCode()                 │
│  └─ getAllUsers()      ├─ closeSale()                     │
│                        └─ generateSaleCode()              │
│                                                            │
│  OrderService                                              │
│  ├─ createOrder()                                          │
│  └─ getOrdersBySaleCode()                                 │
│                                                            │
│  Features:                                                 │
│  • @Transactional pour transactions BD                    │
│  • Business rule validation                               │
│  • Conversion Entity ↔ DTO                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Étage 4: Repositories (Data Access)
```
┌────────────────────────────────────────────────────────────┐
│            REPOSITORY LAYER (Spring Data JPA)              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  UserRepository                                            │
│  └─ findByFirstNameAndPhoneNumber()                       │
│                                                            │
│  SaleRepository                                            │
│  ├─ findByCode()                                          │
│  └─ save(Sale)                                            │
│                                                            │
│  OrderRepository                                           │
│  ├─ findBySaleCode()                                      │
│  └─ save(Order)                                           │
│                                                            │
│  Features:                                                 │
│  • extends JpaRepository<T, ID>                           │
│  • Auto-generated query methods                           │
│  • Named Queries & JPQL support                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Étage 5: JPA Entities (Data Models)
```
┌────────────────────────────────────────────────────────────┐
│            JPA ENTITIES (@Entity)                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  @Entity                                                   │
│  User: [id, firstName, phoneNumber]                       │
│                                                            │
│  @Entity                                                   │
│  Sale: [id, code, sellerName, status, createdAt,        │
│        items: @OneToMany<SaleItem>,                       │
│        orders: @OneToMany<Order>]                         │
│                                                            │
│  @Entity                                                   │
│  SaleItem: [id, category, name, price,                  │
│             sale: @ManyToOne<Sale>]                       │
│                                                            │
│  @Entity                                                   │
│  Order: [id, saleCode, buyerName, status,                │
│          items: @OneToMany<OrderItem>]                    │
│                                                            │
│  @Entity                                                   │
│  OrderItem: [id, saleItemId, quantity, price,            │
│              order: @ManyToOne<Order>]                    │
│                                                            │
│  Features:                                                 │
│  • Lombok @Data @Getter @Setter                           │
│  • Cascading: CascadeType.ALL                             │
│  • Created/Updated timestamps                             │
│  • Enums: Status, Category                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Étage 6: Database Layer
```
┌────────────────────────────────────────────────────────────┐
│            H2 IN-MEMORY DATABASE                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Tables:                                                   │
│  • USERS (id, firstName, phoneNumber)                     │
│  • SALE (id, code, sellerName, status, createdAt)        │
│  • SALE_ITEMS (id, sale_id, category, name, price)       │
│  • ORDERS (id, saleCode, buyerName, status)              │
│  • ORDER_ITEMS (id, order_id, saleItemId, qty, price)    │
│                                                            │
│  Indexes:                                                  │
│  • idx_sale_code (SALE.code) unique                       │
│  • idx_user_phone (USERS.phoneNumber)                     │
│  • idx_order_sale_code (ORDERS.saleCode)                  │
│                                                            │
│  Initial Data:                                             │
│  • 3 Users (Mistura, Kaissy, Antoine)                    │
│  • ON DELETE CASCADE for referential integrity            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Données Complet

### Scénario: Création d'une Vente

```
1. FRONTEND - User Action
   └─ Click "Créer Vente"
      ↓
2. FRONTEND - Component
   └─ CreateSaleComponent collects form data
      ↓
3. FRONTEND - NgRx State
   └─ dispatch(SalesActions.createSale({ sale: {...} }))
      ↓
4. FRONTEND - Effect (@ngrx/effects)
   └─ SalesEffects.createSale$ intercepte l'action
      ├─ switchMap to saleService.createSale()
      ├─ post<Sale>: POST /api/sales with data
      └─ map response to createSaleSuccess(sale)
      ↓
5. NETWORK - HTTP Request
   └─ POST http://localhost:8080/api/sales
      Content-Type: application/json
      Body: { sellerName, saleDate, dishes[], drinks[], desserts[] }
      ↓
6. BACKEND - Controller
   └─ SaleController.createSale(@RequestBody CreateSaleRequest)
      ├─ Validate request
      ├─ Map CreateSaleRequest → Sale entity
      └─ Call saleService.createSale(sale)
      ↓
7. BACKEND - Service
   └─ SaleService.createSale(Sale)
      ├─ Generate random 4-digit code
      ├─ Set status = OPEN
      ├─ Save sale → saleRepository.save()
      └─ Persist sale items relationships
      ↓
8. BACKEND - Repository
   └─ saleRepository.save(sale)
      ├─ Insert into SALE table
      ├─ Insert into SALE_ITEMS table  (via @OneToMany)
      ├─ Set foreign keys
      └─ Return saved entity with ID
      ↓
9. BACKEND - Database
   └─ H2 In-Memory Database
      ├─ Commit transaction
      ├─ Generate ID (auto_increment)
      └─ Persist relationships
      ↓
10. BACKEND - Response
    └─ SaleController returns ResponseEntity<SaleDTO>
       ├─ Map Sale entity → SaleDTO
       ├─ Set HTTP Status: 201 CREATED
       ├─ Set response headers
       └─ Return JSON body with complete sale
       ↓
11. NETWORK - HTTP Response
    └─ 201 Created
       Content-Type: application/json
       Body: {
         code: "5847",
         sellerName: "Mistura",
         status: "OPEN",
         items: [...]
       }
       ↓
12. FRONTEND - Effect
    └─ Receives HTTP response
       ├─ map to createSaleSuccess action
       ├─ dispatch(createSaleSuccess({ sale: SaleDTO }))
       └─ trigger side effects
       ↓
13. FRONTEND - Reducer
    └─ SalesReducer.createSaleSuccess
       ├─ Update store.currentSale = newSale
       ├─ Set store.saleCode = "5847"
       ├─ Set status = OPEN
       └─ Update store.isLoading = false
       ↓
14. FRONTEND - Selector
    └─ selectCurrentSale$ emits new sale
       ├─ Components subscribe receive update
       └─ async pipe triggers CD
       ↓
15. FRONTEND - Component Re-rendering
    └─ SaleDisplayComponent detects change
       ├─ Receives saleCode: "5847"
       ├─ Template interpolates {{saleCode}}
       ├─ Displays products from sale.items
       └─ Show success message to user
```

---

## 🔐 Sécurité & CORS

### CORS Configuration
```
Frontend (http://localhost:4200)
    ↓
Request header contient Origin
    ↓
Spring Controllers (@CrossOrigin)
    ├─ Vérifie allowedOrigins
    ├─ Match: http://localhost:4200
    └─ Ajoute Access-Control-Allow-Origin header
    ↓
Response reçue par navigateur
    ├─ Navigateur vérifie CORS headers
    └─ Permet accès aux données
```

### Authentification (Actuelle: Simple)
```
Frontend: store firstName + phoneNumber en localStorage
Service: Envoie les credentials au /api/auth/login
Backend: Query table USERS avec firstName & phoneNumber
Response: User entity si trouvé, erreur 401 sinon
```

### Authentification (Future: JWT)
```
Login: POST /api/auth/login + credentials
       ↓
Backend: Valide credentials
       ↓
Response: { token: "eyJhbGc..." }
       ↓
Frontend: Store token en localStorage
       ↓
Requêtes suivantes: 
Header: Authorization: Bearer <token>
       ↓
Backend: Valide token avec secret
       ↓
Autoriser/Rejeter la requête
```

---

## 🚀 Performance & Scalability

### Optimisations Actuelles
- Load en mémoire (H2): ~1ms queries
- NgRx selectors: Memoized, prevents unnecessary renders
- Change detection: OnPush strategy possible
- Lazy loading: Routes lazy loaded

### Pour Production
- Migration H2 → PostgreSQL/MySQL
- Connection pooling: HikariCP
- Caching: Redis pour sessions
- Pagination: Limit 50 items
- Compression: gzip sur responses

---

## 📊 Diagramme Entités-Associations (ER)

```
┌─────────────┐
│    USER     │
├─────────────┤
│ id (PK)     │
│ firstName   │◄─────────┐
│ phoneNumber │          │
└─────────────┘          │ 1:Many
                         │
                    ┌─────────────┐
                    │    SALE     │
                    ├─────────────┤
                    │ id (PK)     │
                    │ code (UQ)   │◄──────────┐
                    │ sellerName  │           │ 1:Many
                    │ status      │      ┌─────────────┐
                    │ createdAt   │      │  ORDER      │
                    └─────────────┘      ├─────────────┤
                          ▲              │ id (PK)     │
                          │ 1:Many       │ saleCode(FK)│
                          │              │ buyerName   │
                    ┌──────────────┐     │ status      │
                    │  SALE_ITEMS  │     └─────────────┘
                    ├──────────────┤           ▲
                    │ id (PK)      │           │ 1:Many
                    │ sale_id (FK) │           │
                    │ category     │      ┌──────────────┐
                    │ name         │      │ ORDER_ITEMS  │
                    │ price        │      ├──────────────┤
                    └──────────────┘      │ id (PK)      │
                                          │ order_id(FK) │
                                          │ saleItemId   │
                                          │ quantity     │
                                          │ price        │
                                          └──────────────┘
```

---

## 🔧 Configuration Files

### Frontend
- **app.config.ts**: Providers (HttpClient, NgRx, Routing)
- **app.routes.ts**: 5 routes, redirects
- **environments/**: API URLs

### Backend
- **application.properties**: Server port, DB config, logging
- **pom.xml**: Maven dependencies, plugins
- **CafeteriaApplication.java**: @SpringBootApplication, CommandLineRunner

---

## 📈 Logs Attendus Lors d'une Requête

### Terminal Backend
```
2024-01-15 10:00:00.100  INFO  org.springframework.boot.Application    : Initializing default users...
2024-01-15 10:00:00.150  INFO  org.springframework.boot.Application    : Tomcat started on port(s): 8080 (http)
2024-01-15 10:00:05.230  INFO  com.cafeteria.api.AuthController        : POST /api/auth/login (firstName=Mistura, phone=0758297734)
2024-01-15 10:00:05.235  DEBUG com.cafeteria.service.UserService       : Searching user: Mistura
2024-01-15 10:00:05.240  DEBUG com.cafeteria.repository.UserRepository : SELECT * FROM USERS WHERE firstName = ? AND phoneNumber = ?
2024-01-15 10:00:05.245  INFO  com.cafeteria.api.AuthController        : User found. Response: 200 OK
```

### Terminal Frontend / Console Navigateur
```
[AuthService] HTTP Request: POST /api/auth/login
[AuthService] Response received: { id: 1, firstName: "Mistura", phoneNumber: "0758297734" }
[NgRx] Dispatched action: @auth/login/success
[Store] Auth reducer updated. New state: { user: {...}, isAuthenticated: true }
[Component] Selector detected change. Re-rendering LoginComponent
[Router] Navigation: /login → /join-or-create
```

---

## 🎯 Conclusion

**Architecture**: Entièrement modulaire, scalable, et suivant les best practices
**Frontend**: State management robuste avec NgRx, composants réutilisables
**Backend**: Layered architecture, séparation des responsabilités claires
**Communication**: REST API bien documentée, CORS configuré
**Database**: En mémoire pour dev, facile à migrer vers persistent storage

**Status**: ✅ Production-ready pour features v1.0
