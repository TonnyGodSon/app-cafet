import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, firstValueFrom } from 'rxjs';
import { selectActiveSale, selectActiveSaleCode } from '../../store/sales/sales.selectors';
import { selectOrderItems, selectOrderTotal } from '../../store/orders/orders.selectors';
import { MOCK_DISHES, MOCK_DRINKS, MOCK_DESSERTS, OrderItem, PaymentBreakdown, PaymentMethod, SaleItemWithSpecs } from '../../core/models';
import * as OrdersActions from '../../store/orders/orders.actions';

interface MenuDisplayItem {
  name: string;
  price: number;
  image: string;
  category: 'dish' | 'drink' | 'dessert';
}

type PaymentOption = 'CB' | 'PayPal' | 'Wero' | 'Espèces';

interface PaymentEntry {
  selected: boolean;
  amount: number;
}

@Component({
  selector: 'app-sale-display',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="sale-display-container" [class.cashier-mode]="isCashierMode">
      <div class="header">
        <div class="brand-wrap">
          <img class="brand-logo" src="assets/brand/logo-food.svg" alt="Logo CaFaith Normandie" />
          <div>
            <div class="brand-name">CaFaith Normandie</div>
            <div class="sale-code-display">Code Vente: {{ (saleCode$ | async) || '--' }}</div>
          </div>
        </div>
        <div class="header-info">
          <button mat-stroked-button class="cashier-mode-btn" (click)="toggleCashierMode()">
            <mat-icon>{{ isCashierMode ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
            {{ isCashierMode ? 'Quitter Mode Caisse' : 'Mode Caisse' }}
          </button>
          <span>{{ getCurrentDate() }}</span>
          <button mat-raised-button color="warn" (click)="onCloseSale()">
            <mat-icon>event_busy</mat-icon>
            Fermer la Vente
          </button>
        </div>
      </div>

      <div class="content">
        <!-- Products Selection (Left) -->
        <div class="products-section">
          <div class="express-toolbar">
            <mat-form-field class="search-field" appearance="outline">
              <mat-label>Recherche rapide</mat-label>
              <input matInput [(ngModel)]="productSearch" name="productSearch" placeholder="Ex: Poulet, Coca, Gateau..." />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <div class="live-stats">
              <span class="stat-chip"><mat-icon>restaurant_menu</mat-icon>{{ selectedDishUnits }} plats</span>
              <span class="stat-chip"><mat-icon>local_bar</mat-icon>{{ selectedDrinkUnits }} boissons</span>
              <span class="stat-chip"><mat-icon>cake</mat-icon>{{ selectedDessertUnits }} desserts</span>
              <span class="stat-chip total"><mat-icon>shopping_bag</mat-icon>{{ totalSelectedUnits }} articles</span>
            </div>

            <button mat-stroked-button type="button" class="clear-search-btn" (click)="clearSearch()" [disabled]="!productSearch.trim()">
              <mat-icon>backspace</mat-icon>
              Effacer
            </button>
          </div>

          <mat-tab-group [selectedIndex]="selectedTabIndex" (selectedIndexChange)="selectedTabIndex = $event">
            <!-- Plats Tab -->
            <mat-tab label="Plats">
              <div *ngIf="filteredDishes.length === 0" class="empty-state">
                Aucun plat ne correspond à la recherche.
              </div>
              <div class="products-grid" *ngIf="filteredDishes.length > 0">
                <div
                  *ngFor="let dish of filteredDishes"
                  class="product-card"
                >
                  <img class="product-image" [src]="dish.image" [alt]="dish.name" (click)="incrementProduct(dish)" />
                  <div class="product-name" (click)="incrementProduct(dish)">{{ dish.name }}</div>
                  <div class="product-price" (click)="incrementProduct(dish)">{{ dish.price.toFixed(2) }} €</div>
                  <div class="product-qty-controls" (click)="$event.stopPropagation()">
                    <button mat-icon-button class="qty-minus" (click)="decrementProduct(dish)" [disabled]="getProductQuantity(dish.name) === 0">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="qty-value" [class.active]="getProductQuantity(dish.name) > 0">{{ getProductQuantity(dish.name) }}</span>
                    <button mat-icon-button class="qty-plus" (click)="incrementProduct(dish)">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Boissons Tab -->
            <mat-tab label="Boissons">
              <div *ngIf="filteredDrinks.length === 0" class="empty-state">
                Aucune boisson ne correspond à la recherche.
              </div>
              <div class="products-grid" *ngIf="filteredDrinks.length > 0">
                <div
                  *ngFor="let drink of filteredDrinks"
                  class="product-card"
                >
                  <img class="product-image" [src]="drink.image" [alt]="drink.name" (click)="incrementProduct(drink)" />
                  <div class="product-name" (click)="incrementProduct(drink)">{{ drink.name }}</div>
                  <div class="product-price" (click)="incrementProduct(drink)">{{ drink.price.toFixed(2) }} €</div>
                  <div class="product-qty-controls" (click)="$event.stopPropagation()">
                    <button mat-icon-button class="qty-minus" (click)="decrementProduct(drink)" [disabled]="getProductQuantity(drink.name) === 0">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="qty-value" [class.active]="getProductQuantity(drink.name) > 0">{{ getProductQuantity(drink.name) }}</span>
                    <button mat-icon-button class="qty-plus" (click)="incrementProduct(drink)">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Desserts Tab -->
            <mat-tab label="Desserts">
              <div *ngIf="filteredDesserts.length === 0" class="empty-state">
                Aucun dessert ne correspond à la recherche.
              </div>
              <div class="products-grid" *ngIf="filteredDesserts.length > 0">
                <div
                  *ngFor="let dessert of filteredDesserts"
                  class="product-card"
                >
                  <img class="product-image" [src]="dessert.image" [alt]="dessert.name" (click)="incrementProduct(dessert)" />
                  <div class="product-name" (click)="incrementProduct(dessert)">{{ dessert.name }}</div>
                  <div class="product-price" (click)="incrementProduct(dessert)">{{ dessert.price.toFixed(2) }} €</div>
                  <div class="product-qty-controls" (click)="$event.stopPropagation()">
                    <button mat-icon-button class="qty-minus" (click)="decrementProduct(dessert)" [disabled]="getProductQuantity(dessert.name) === 0">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="qty-value" [class.active]="getProductQuantity(dessert.name) > 0">{{ getProductQuantity(dessert.name) }}</span>
                    <button mat-icon-button class="qty-plus" (click)="incrementProduct(dessert)">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Order Summary (Right) -->
        <div class="order-section">
          <!-- Cart -->
          <mat-card class="cart-card">
            <mat-card-header>
              <mat-card-title>Panier ({{ (items$ | async)?.length || 0 }})</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="cart-items">
                <div *ngFor="let item of items$ | async" class="cart-item">
                  <div class="item-info">
                    <strong>{{ item.productName }}</strong>
                    <span>{{ item.quantity }} x {{ item.price.toFixed(2) }} €</span>
                  </div>
                  <div class="item-total">
                    {{ (item.quantity * item.price).toFixed(2) }} €
                  </div>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="removeItem(item.productId)"
                    aria-label="Supprimer l'article"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>

              <div class="cart-total">
                <strong>Total: {{ (total$ | async)?.toFixed(2) || '0.00' }} €</strong>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Payment Method -->
          <mat-card class="payment-card">
            <mat-card-header>
              <mat-card-title>Mode de Paiement</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-form-field class="full-width">
                <mat-label>Prénom du client</mat-label>
                <input
                  matInput
                  [(ngModel)]="customerFirstName"
                  name="customerFirstName"
                  placeholder="Ex: Sarah"
                />
              </mat-form-field>

              <div class="payment-options">
                <div *ngFor="let method of paymentMethods" class="payment-row">
                  <mat-checkbox
                    [(ngModel)]="paymentState[method].selected"
                    (change)="onPaymentToggle(method)"
                  >
                    <span class="payment-label">
                      <mat-icon>{{ paymentIcon(method) }}</mat-icon>
                      {{ method }}
                    </span>
                  </mat-checkbox>

                  <mat-form-field class="payment-amount-field" appearance="outline">
                    <mat-label>Montant (€)</mat-label>
                    <input
                      matInput
                      type="number"
                      min="0"
                      step="0.01"
                      [disabled]="!paymentState[method].selected"
                      [(ngModel)]="paymentState[method].amount"
                      (ngModelChange)="onPaymentAmountChange(method, $event)"
                      [name]="'amount-' + method"
                    />
                  </mat-form-field>
                </div>

                <div class="payment-summary">
                  <span>Total commande: {{ orderTotalValue.toFixed(2) }} €</span>
                  <span [class.valid]="isPaymentBalanced" [class.invalid]="!isPaymentBalanced">
                    Total paiements: {{ totalPaymentAmount.toFixed(2) }} €
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Action Button -->
          <button
            mat-raised-button
            color="primary"
            class="validate-btn"
            [disabled]="!canValidateOrder"
            (click)="onValidateOrder()"
          >
            <mat-icon>check_circle</mat-icon>
            Valider la Commande
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sale-display-container {
      min-height: 100vh;
      background: radial-gradient(circle at top left, #fff7e8, #eef6ff 55%, #f7f8ff);
      padding: 1.25rem;
    }

    .header {
      background: #ffffffd9;
      backdrop-filter: blur(8px);
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 18px;
      margin-bottom: 1.1rem;
      border: 1px solid #efe3cd;
      box-shadow: 0 14px 30px rgba(45, 53, 79, 0.08);
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      object-fit: cover;
      box-shadow: inset 0 0 0 1px #f7b67a;
    }

    .brand-name {
      font-weight: 800;
      letter-spacing: 0.02em;
      color: #2d3550;
    }

    .sale-code-display {
      font-size: 0.95rem;
      color: #566080;
      font-weight: 600;
    }

    .header-info {
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .cashier-mode-btn {
      border-color: #7f93c9 !important;
      color: #3f4d79;
      font-weight: 700;
      background: #f5f8ff;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .products-section {
      background-color: #ffffffea;
      border-radius: 18px;
      border: 1px solid #ebedf7;
      box-shadow: 0 14px 30px rgba(45, 53, 79, 0.08);
      padding: 1rem;
    }

    .express-toolbar {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto auto;
      gap: 0.75rem;
      align-items: center;
      background: linear-gradient(135deg, #fff8ec, #eef6ff);
      border: 1px solid #e6e9f5;
      border-radius: 14px;
      padding: 0.7rem;
      margin-bottom: 0.9rem;
    }

    .search-field {
      width: 100%;
      margin-bottom: -1.1rem;
    }

    .live-stats {
      display: flex;
      gap: 0.45rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .stat-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.3rem 0.6rem;
      border-radius: 999px;
      border: 1px solid #d6deef;
      background: #fff;
      color: #3a486f;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .stat-chip mat-icon {
      width: 1rem;
      height: 1rem;
      font-size: 1rem;
      color: #dd6c20;
    }

    .stat-chip.total {
      border-color: #c9d9ff;
      color: #1f4f9d;
      background: #f3f7ff;
    }

    .clear-search-btn {
      border-color: #8ea0cc !important;
      color: #4d5b82;
      white-space: nowrap;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1rem 0;
    }

    .empty-state {
      border: 1px dashed #d9e0f0;
      border-radius: 12px;
      background: #f9fbff;
      color: #5e6c91;
      text-align: center;
      padding: 1rem;
      margin: 0.8rem 0;
      font-weight: 600;
    }

    .product-card {
      background: linear-gradient(160deg, #ffffff, #fff9ef);
      border: 1px solid #eee4d3;
      border-radius: 14px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(8px) scale(0.98);
      animation: cardIn 420ms ease-out forwards;
    }

    .product-card:nth-child(1) { animation-delay: 50ms; }
    .product-card:nth-child(2) { animation-delay: 110ms; }
    .product-card:nth-child(3) { animation-delay: 170ms; }
    .product-card:nth-child(4) { animation-delay: 230ms; }
    .product-card:nth-child(5) { animation-delay: 290ms; }
    .product-card:nth-child(6) { animation-delay: 350ms; }

    .product-card:hover {
      border-color: #f0b46f;
      transform: translateY(-2px);
      box-shadow: 0 10px 18px rgba(255, 169, 72, 0.2);
    }

    .product-image {
      width: 74px;
      height: 74px;
      object-fit: cover;
      border-radius: 12px;
      margin: 0 auto 0.7rem;
      border: 1px solid #f3dcc0;
      background: #fff;
      transition: transform 0.25s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #334065;
      line-height: 1.2rem;
      min-height: 2.4rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
    }

    .product-price {
      color: #dd6c20;
      font-weight: 700;
      margin-top: 0.5rem;
      cursor: pointer;
    }

    .product-qty-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      margin-top: 0.6rem;
      border-top: 1px solid #f0e8da;
      padding-top: 0.5rem;
    }

    .qty-minus, .qty-plus {
      width: 30px;
      height: 30px;
      line-height: 30px;
    }

    .qty-minus mat-icon, .qty-plus mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      line-height: 1rem;
    }

    .qty-minus {
      color: #9aa3be;
    }

    .qty-minus:not([disabled]) {
      color: #c94b43;
    }

    .qty-plus {
      color: #2b8a4a;
    }

    .qty-value {
      font-weight: 700;
      font-size: 1rem;
      min-width: 28px;
      text-align: center;
      color: #aab0c6;
    }

    .qty-value.active {
      color: #2d3550;
    }

    .order-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-card, .payment-card {
      background-color: #ffffffea;
      border: 1px solid #ebedf7;
      box-shadow: 0 14px 30px rgba(45, 53, 79, 0.08);
    }

    .cart-items {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 1rem;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .item-info {
      flex: 1;
      font-size: 0.9rem;
      min-width: 0;
    }

    .item-info strong {
      display: block;
      line-height: 1.2rem;
      white-space: normal;
      word-break: break-word;
    }

    .item-info span {
      display: block;
      color: #666;
    }

    .item-total {
      margin: 0 1rem;
      font-weight: bold;
      min-width: 70px;
      text-align: right;
      white-space: nowrap;
    }

    .cart-total {
      padding-top: 1rem;
      border-top: 2px solid #667eea;
      font-size: 1.1rem;
      text-align: right;
      color: #667eea;
    }

    .payment-options {
      margin-top: 0.5rem;
    }

    .payment-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      padding: 0.35rem 0;
    }

    .payment-label {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      color: #2d3550;
    }

    .payment-label mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #dd6c20;
    }

    .payment-amount-field {
      width: 150px;
    }

    .payment-summary {
      margin-top: 0.8rem;
      border-top: 1px dashed #d6ddef;
      padding-top: 0.7rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: #4a5677;
    }

    .payment-summary .valid {
      color: #18804d;
      font-weight: 700;
    }

    .payment-summary .invalid {
      color: #b24a43;
      font-weight: 700;
    }

    .full-width {
      width: 100%;
    }

    .validate-btn {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .validate-btn:not([disabled]):hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(60, 92, 154, 0.25);
    }

    .sale-display-container.cashier-mode {
      padding: 0.7rem;
      background: radial-gradient(circle at top left, #fff3dc, #eaf3ff 58%, #eef5ff);
    }

    .sale-display-container.cashier-mode .header {
      padding: 0.8rem 1rem;
      border-radius: 14px;
    }

    .sale-display-container.cashier-mode .content {
      gap: 1rem;
      grid-template-columns: 1fr 380px;
    }

    .sale-display-container.cashier-mode .products-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.7rem;
      padding: 0.7rem 0;
    }

    .sale-display-container.cashier-mode .product-card {
      padding: 0.7rem;
      border-radius: 12px;
    }

    .sale-display-container.cashier-mode .product-image {
      width: 66px;
      height: 66px;
      margin-bottom: 0.45rem;
    }

    .sale-display-container.cashier-mode .product-name {
      font-size: 0.9rem;
      min-height: 2.1rem;
    }

    .sale-display-container.cashier-mode .qty-minus,
    .sale-display-container.cashier-mode .qty-plus {
      width: 36px;
      height: 36px;
    }

    .sale-display-container.cashier-mode .qty-value {
      font-size: 1.05rem;
      min-width: 32px;
    }

    .sale-display-container.cashier-mode .cart-items {
      max-height: 360px;
    }

    @keyframes cardIn {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 1024px) {
      .content {
        grid-template-columns: 1fr;
      }

      .header {
        align-items: flex-start;
      }

      .header-info {
        gap: 0.6rem;
      }

      .express-toolbar {
        grid-template-columns: 1fr;
      }

      .live-stats {
        justify-content: flex-start;
      }

      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .payment-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .payment-amount-field {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .products-grid {
        grid-template-columns: 1fr;
      }

      .cart-item {
        gap: 0.35rem;
      }
    }
  `]
})
export class SaleDisplayComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformId = inject(PLATFORM_ID);

  dishes: MenuDisplayItem[] = [];
  drinks: MenuDisplayItem[] = [];
  desserts: MenuDisplayItem[] = [];
  paymentMethods: PaymentOption[] = ['CB', 'PayPal', 'Wero', 'Espèces'];
  selectedTabIndex = 0;
  customerFirstName = '';
  productSearch = '';
  isCashierMode = false;
  orderTotalValue = 0;
  orderItemCount = 0;
  orderItems: OrderItem[] = [];
  paymentState: Record<PaymentOption, PaymentEntry> = {
    CB: { selected: false, amount: 0 },
    PayPal: { selected: false, amount: 0 },
    Wero: { selected: false, amount: 0 },
    Espèces: { selected: false, amount: 0 }
  };

  private readonly imageCatalog = new Map<string, string>([
    ...MOCK_DISHES.map((item) => [item.name, item.image] as const),
    ...MOCK_DRINKS.map((item) => [item.name, item.image] as const),
    ...MOCK_DESSERTS.map((item) => [item.name, item.image] as const)
  ]);

  items$!: Observable<OrderItem[]>;
  total$!: Observable<number>;
  saleCode$!: Observable<string | null>;
  activeSale$ = this.store.select(selectActiveSale);

  ngOnInit() {
    this.items$ = this.store.select(selectOrderItems);
    this.total$ = this.store.select(selectOrderTotal);
    this.saleCode$ = this.store.select(selectActiveSaleCode);
    this.items$.subscribe((items) => {
      this.orderItemCount = items.length;
      this.orderItems = items;
    });
    this.total$.subscribe((value) => {
      this.orderTotalValue = value;
    });
    this.activeSale$.subscribe((sale) => {
      this.dishes = this.toDisplayItems(sale?.dishes || [], 'dish');
      this.drinks = this.toDisplayItems(sale?.drinks || [], 'drink');
      this.desserts = this.toDisplayItems(sale?.desserts || [], 'dessert');
    });
  }

  selectProduct(product: MenuDisplayItem) {
    this.incrementProduct(product);
  }

  async toggleCashierMode(): Promise<void> {
    this.isCashierMode = !this.isCashierMode;

    if (!isPlatformBrowser(this.platformId) || typeof document === 'undefined') {
      return;
    }

    try {
      if (this.isCashierMode && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      if (!this.isCashierMode && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: keep visual cashier mode even if fullscreen API is blocked.
    }
  }

  clearSearch(): void {
    this.productSearch = '';
  }

  get filteredDishes(): MenuDisplayItem[] {
    return this.filterProducts(this.dishes);
  }

  get filteredDrinks(): MenuDisplayItem[] {
    return this.filterProducts(this.drinks);
  }

  get filteredDesserts(): MenuDisplayItem[] {
    return this.filterProducts(this.desserts);
  }

  get selectedDishUnits(): number {
    return this.sumCategoryUnits('dish');
  }

  get selectedDrinkUnits(): number {
    return this.sumCategoryUnits('drink');
  }

  get selectedDessertUnits(): number {
    return this.sumCategoryUnits('dessert');
  }

  get totalSelectedUnits(): number {
    return this.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getProductQuantity(productName: string): number {
    return this.orderItems.find(i => i.productId === productName)?.quantity ?? 0;
  }

  incrementProduct(product: MenuDisplayItem): void {
    const existing = this.orderItems.find(i => i.productId === product.name);
    if (existing) {
      this.store.dispatch(OrdersActions.updateItemQuantity({ productId: product.name, quantity: existing.quantity + 1 }));
    } else {
      const item: OrderItem = {
        productId: product.name,
        productName: product.name,
        price: product.price,
        quantity: 1,
        category: product.category
      };
      this.store.dispatch(OrdersActions.addItem({ item }));
    }
  }

  decrementProduct(product: MenuDisplayItem): void {
    const existing = this.orderItems.find(i => i.productId === product.name);
    if (!existing) return;
    if (existing.quantity > 1) {
      this.store.dispatch(OrdersActions.updateItemQuantity({ productId: product.name, quantity: existing.quantity - 1 }));
    } else {
      this.store.dispatch(OrdersActions.removeItem({ productId: product.name }));
    }
  }

  private normalizeLabel(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private filterProducts(products: MenuDisplayItem[]): MenuDisplayItem[] {
    const query = this.normalizeLabel(this.productSearch.trim());
    if (!query) {
      return products;
    }
    return products.filter((product) => this.normalizeLabel(product.name).includes(query));
  }

  private sumCategoryUnits(category: 'dish' | 'drink' | 'dessert'): number {
    return this.orderItems
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  private toDisplayItems(
    items: SaleItemWithSpecs[],
    category: 'dish' | 'drink' | 'dessert'
  ): MenuDisplayItem[] {
    return items.map((item) => ({
      name: item.productName,
      price: item.price,
      category,
      image: this.resolveImage(item.productName, category)
    }));
  }

  private resolveImage(
    productName: string,
    category: 'dish' | 'drink' | 'dessert'
  ): string {
    const normalized = productName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const direct = this.imageCatalog.get(productName);
    if (direct) {
      return direct;
    }

    if (category === 'dish') {
      if (normalized.includes('poisson') || normalized.includes('atti')) return 'assets/dishes/poisson.svg';
      if (normalized.includes('poulet') || normalized.includes('pomme')) return 'assets/dishes/poulet.svg';
      if (normalized.includes('viande') || normalized.includes('riz') || normalized.includes('boeuf')) return 'assets/dishes/viande.svg';
      return 'assets/dishes/viande.svg';
    }

    if (category === 'drink') {
      if (normalized.includes('coca')) return 'assets/drinks/coca.svg';
      if (normalized.includes('orangina') || normalized.includes('orange')) return 'assets/drinks/orangina.svg';
      if (normalized.includes('oasis')) return 'assets/drinks/oasis.svg';
      if (normalized.includes('bissap')) return 'assets/drinks/bissap.svg';
      if (normalized.includes('gingembre') || normalized.includes('jus')) return 'assets/drinks/gingembre.svg';
      return 'assets/drinks/oasis.svg';
    }

    if (normalized.includes('cookie')) return 'assets/desserts/cookies.svg';
    if (normalized.includes('gateau') || normalized.includes('cake')) return 'assets/desserts/gateau.svg';
    if (normalized.includes('degue') || normalized.includes('yaourt')) return 'assets/desserts/degue.svg';
    return 'assets/desserts/gateau.svg';
  }

  removeItem(productId: string) {
    this.store.dispatch(OrdersActions.removeItem({ productId }));
  }

  onPaymentToggle(method: PaymentOption) {
    if (!this.paymentState[method].selected) {
      this.paymentState[method].amount = 0;
    }
  }

  onPaymentAmountChange(method: PaymentOption, value: string | number) {
    const parsed = typeof value === 'number' ? value : parseFloat(value || '0');
    this.paymentState[method].amount = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  get totalPaymentAmount(): number {
    return this.paymentMethods.reduce((sum, method) => {
      const entry = this.paymentState[method];
      return sum + (entry.selected ? entry.amount : 0);
    }, 0);
  }

  get isPaymentBalanced(): boolean {
    return Math.abs(this.totalPaymentAmount - this.orderTotalValue) < 0.01;
  }

  get hasAtLeastOnePayment(): boolean {
    return this.paymentMethods.some((method) => {
      const entry = this.paymentState[method];
      return entry.selected && entry.amount > 0;
    });
  }

  get canValidateOrder(): boolean {
    return (
      this.hasAtLeastOnePayment &&
      this.isPaymentBalanced &&
      this.customerFirstName.trim().length > 0 &&
      this.orderItemCount > 0
    );
  }

  private resolvePaymentMethod(): PaymentMethod {
    const selected = this.paymentMethods.filter((method) => {
      const entry = this.paymentState[method];
      return entry.selected && entry.amount > 0;
    });

    if (selected.length === 1) {
      return selected[0];
    }
    return 'Mixte';
  }

  private buildPaymentBreakdown(): PaymentBreakdown {
    const breakdown: PaymentBreakdown = {};
    this.paymentMethods.forEach((method) => {
      const entry = this.paymentState[method];
      if (entry.selected && entry.amount > 0) {
        breakdown[method] = Number(entry.amount.toFixed(2));
      }
    });
    return breakdown;
  }

  paymentIcon(method: PaymentOption): string {
    if (method === 'CB') return 'credit_card';
    if (method === 'PayPal') return 'account_balance_wallet';
    if (method === 'Wero') return 'qr_code_2';
    return 'payments';
  }

  async onValidateOrder() {
    if (!this.customerFirstName.trim()) {
      this.snackBar.open('Veuillez saisir le prénom du client.', 'OK', { duration: 2600 });
      return;
    }

    const items = await firstValueFrom(this.items$);
    if (items.length === 0) {
      this.snackBar.open('Veuillez ajouter au moins un produit avant validation.', 'OK', { duration: 2800 });
      return;
    }

    if (!this.canValidateOrder) {
      this.snackBar.open('Le total des moyens de paiement doit être égal au total commande.', 'OK', { duration: 3200 });
      return;
    }

    const saleCode = await firstValueFrom(this.saleCode$);
    if (!saleCode) {
      this.snackBar.open('Code de vente introuvable.', 'OK', { duration: 2600 });
      return;
    }

    this.store.dispatch(
      OrdersActions.submitOrder({
        saleCode,
        customerFirstName: this.customerFirstName.trim(),
        paymentMethod: this.resolvePaymentMethod(),
        paymentBreakdown: this.buildPaymentBreakdown()
      })
    );
    this.snackBar.open('Commande validée avec succès.', 'OK', { duration: 2600 });
    this.customerFirstName = '';
    this.paymentMethods.forEach((method) => {
      this.paymentState[method] = { selected: false, amount: 0 };
    });
    this.selectedTabIndex = 0;
  }

  onCloseSale() {
    this.router.navigate(['/close-sale']);
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('fr-FR');
  }
}
