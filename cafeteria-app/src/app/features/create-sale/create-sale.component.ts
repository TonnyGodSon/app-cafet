import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import * as SalesActions from '../../store/sales/sales.actions';
import { MOCK_DISHES, MOCK_DRINKS, MOCK_DESSERTS, MOCK_USERS } from '../../core/models';
import { Sale, SaleItemWithSpecs } from '../../core/models';

@Component({
  selector: 'app-create-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="create-sale-container">
      <mat-card class="create-sale-card">
        <mat-card-header>
          <div class="brand-banner">
            <img src="assets/brand/logo-food.svg" alt="Logo CaFaith Normandie" />
            <div>
              <div class="title">CaFaith Normandie</div>
              <div class="subtitle">Créer une nouvelle vente</div>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="saleForm" (ngSubmit)="onCreateSale()">
            <!-- Basic Info Section -->
            <mat-form-field class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Vendeur/se</mat-label>
              <mat-select formControlName="sellerName">
                <mat-option *ngFor="let user of users$ | async" [value]="user.firstName">
                  {{ user.firstName }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Plats Section -->
            <div class="section-title">Plats</div>
            <div *ngFor="let i of [0, 1, 2]" class="item-group">
              <mat-form-field class="full-width">
                <mat-label>Plat {{ i + 1 }}</mat-label>
                <mat-select [formControlName]="'dish' + i">
                  <mat-option *ngFor="let dish of dishes$ | async" [value]="dish.name">
                    {{ dish.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Tarif €</mat-label>
                <input matInput type="number" [formControlName]="'dishPrice' + i" step="0.01" />
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" [formControlName]="'dishQuantity' + i" />
              </mat-form-field>
            </div>

            <!-- Boissons Section -->
            <div class="section-title">Boissons</div>
            <div *ngFor="let i of [0, 1, 2, 3, 4]" class="item-group">
              <mat-form-field class="full-width">
                <mat-label>Boisson {{ i + 1 }}</mat-label>
                <mat-select [formControlName]="'drink' + i">
                  <mat-option *ngFor="let drink of drinks$ | async" [value]="drink.name">
                    {{ drink.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Tarif €</mat-label>
                <input matInput type="number" [formControlName]="'drinkPrice' + i" step="0.01" />
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" [formControlName]="'drinkQuantity' + i" />
              </mat-form-field>
            </div>

            <!-- Desserts Section -->
            <div class="section-title">Desserts</div>
            <div *ngFor="let i of [0, 1, 2]" class="item-group">
              <mat-form-field class="full-width">
                <mat-label>Dessert {{ i + 1 }}</mat-label>
                <mat-select [formControlName]="'dessert' + i">
                  <mat-option *ngFor="let dessert of desserts$ | async" [value]="dessert.name">
                    {{ dessert.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Tarif €</mat-label>
                <input matInput type="number" [formControlName]="'dessertPrice' + i" step="0.01" />
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" [formControlName]="'dessertQuantity' + i" />
              </mat-form-field>
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="!saleForm.get('date')?.value || !saleForm.get('sellerName')?.value"
            >
              Créer la Vente
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-sale-container {
      display: block;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #fff6e9, #eaf5ff 55%, #f5edff);
      padding: 1rem;
    }
    .create-sale-card {
      width: min(1200px, 100%);
      margin: 0 auto;
      padding: 1.2rem 1.4rem;
      min-height: calc(100vh - 2rem);
      border-radius: 16px;
      border: 1px solid #e8ebf7;
      box-shadow: 0 16px 30px rgba(40, 51, 86, 0.12);
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .half-width {
      width: calc(50% - 0.5rem);
      margin-bottom: 1rem;
    }
    .half-width:nth-child(even) {
      margin-left: 1rem;
    }
    .section-title {
      font-weight: 700;
      font-size: 1.1rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      color: #2d3550;
      border-left: 4px solid #f3c375;
      padding-left: 0.6rem;
    }
    .item-group {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    }

    .item-group .full-width {
      grid-column: 1 / -1;
      margin-bottom: 0;
    }

    .item-group .half-width {
      width: 100%;
      margin-bottom: 0;
    }

    .item-group .half-width:nth-child(even) {
      margin-left: 0;
    }

    @media (max-width: 900px) {
      .create-sale-container {
        padding: 0.7rem;
      }

      .create-sale-card {
        min-height: calc(100vh - 1.4rem);
        padding: 1rem;
        border-radius: 14px;
      }
    }

    @media (max-width: 640px) {
      .create-sale-card {
        min-height: calc(100vh - 1rem);
        padding: 0.9rem;
      }

      .item-group {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 1rem;
      }
    }
  `]
})
export class CreateSaleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  saleForm!: FormGroup;
  dishes$!: Observable<any[]>;
  drinks$!: Observable<any[]>;
  desserts$!: Observable<any[]>;
  users$!: Observable<any[]>;

  ngOnInit() {
    this.initializeForm();
    this.dishes$ = of(MOCK_DISHES);
    this.drinks$ = of(MOCK_DRINKS);
    this.desserts$ = of(MOCK_DESSERTS);
    this.users$ = of(MOCK_USERS);
  }

  private initializeForm() {
    const group: any = {
      date: [new Date(), Validators.required],
      sellerName: ['', Validators.required]
    };

    // Adding dish fields - NOT required by default
    for (let i = 0; i < 3; i++) {
      group['dish' + i] = [''];
      group['dishPrice' + i] = [''];
      group['dishQuantity' + i] = [''];
    }

    // Adding drink fields - NOT required by default
    for (let i = 0; i < 5; i++) {
      group['drink' + i] = [''];
      group['drinkPrice' + i] = [''];
      group['drinkQuantity' + i] = [''];
    }

    // Adding dessert fields - NOT required by default
    for (let i = 0; i < 3; i++) {
      group['dessert' + i] = [''];
      group['dessertPrice' + i] = [''];
      group['dessertQuantity' + i] = [''];
    }

    this.saleForm = this.fb.group(group);
  }

  onCreateSale() {
    if (!this.saleForm.valid) {
      alert('Veuillez remplir la date et le vendeur/se');
      return;
    }

    // Check that at least one product is selected
    const dishes = this.extractItems('dish');
    const drinks = this.extractItems('drink');
    const desserts = this.extractItems('dessert');
    
    if (dishes.length === 0 && drinks.length === 0 && desserts.length === 0) {
      alert('Veuillez sélectionner au moins un produit');
      return;
    }

    const sale: Sale = {
      id: Date.now().toString(),
      saleCode: '', // Will be generated by service
      date: this.saleForm.get('date')?.value,
      sellerName: this.saleForm.get('sellerName')?.value,
      dishes,
      drinks,
      desserts,
      createdAt: new Date(),
      status: 'open'
    };

    this.store.dispatch(SalesActions.createSale({ sale }));
    // Navigation will be handled by the Effect after success
  }

  private extractItems(category: string): SaleItemWithSpecs[] {
    const items: SaleItemWithSpecs[] = [];
    const count = category === 'drink' ? 5 : 3;

    for (let i = 0; i < count; i++) {
      const productName = this.saleForm.get(category + i)?.value;
      const price = this.saleForm.get(category + 'Price' + i)?.value;
      const quantity = this.saleForm.get(category + 'Quantity' + i)?.value;

      if (productName && price && quantity) {
        items.push({
          productId: Date.now().toString() + i,
          productName,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10)
        });
      }
    }

    return items;
  }
}
