import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatIconModule } from '@angular/material/icon';
import * as SalesActions from '../../store/sales/sales.actions';
import { MOCK_DISHES, MOCK_DRINKS, MOCK_DESSERTS, MOCK_USERS } from '../../core/models';
import { Sale, SaleItemWithSpecs } from '../../core/models';
import { AuthService, CatalogCategory, CatalogService } from '../../core/services';

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
    MatProgressSpinnerModule,
    MatIconModule
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
                <mat-option *ngFor="let user of users" [value]="user.firstName">
                  {{ user.firstName }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="add-inline-row">
              <mat-form-field class="inline-field">
                <mat-label>Nouvelle vendeuse</mat-label>
                <input matInput [(ngModel)]="newSellerName" [ngModelOptions]="{standalone: true}" name="newSellerName" placeholder="Prénom" />
              </mat-form-field>
              <mat-form-field class="inline-field">
                <mat-label>Téléphone</mat-label>
                <input matInput [(ngModel)]="newSellerPhone" [ngModelOptions]="{standalone: true}" name="newSellerPhone" placeholder="07XXXXXXXX" />
              </mat-form-field>
              <button mat-stroked-button type="button" (click)="onAddSeller()">
                <mat-icon>person_add</mat-icon>
                Ajouter
              </button>
            </div>

            <!-- Plats Section -->
            <div class="section-title">Plats</div>
            <div *ngFor="let i of [0, 1, 2]" class="item-group">
              <mat-form-field class="full-width">
                <mat-label>Plat {{ i + 1 }}</mat-label>
                <mat-select [formControlName]="'dish' + i">
                  <mat-option *ngFor="let dish of dishes" [value]="dish.name">
                    {{ dish.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Tarif €</mat-label>
                <input matInput type="number" [formControlName]="'dishPrice' + i" step="0.01" min="0" />
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" [formControlName]="'dishQuantity' + i" min="0" />
              </mat-form-field>
            </div>

            <div class="add-inline-row">
              <mat-form-field class="inline-field">
                <mat-label>Nouveau plat</mat-label>
                <input matInput [(ngModel)]="newDishName" [ngModelOptions]="{standalone: true}" name="newDishName" placeholder="Nom du plat" />
              </mat-form-field>
              <button mat-stroked-button type="button" (click)="onAddCatalogItem('dish', newDishName)">
                <mat-icon>add</mat-icon>
                Ajouter
              </button>
            </div>

            <!-- Boissons Section -->
            <div class="section-title">Boissons</div>
            <div *ngFor="let i of [0, 1, 2, 3, 4]" class="item-group">
              <mat-form-field class="full-width">
                <mat-label>Boisson {{ i + 1 }}</mat-label>
                <mat-select [formControlName]="'drink' + i">
                  <mat-option *ngFor="let drink of drinks" [value]="drink.name">
                    {{ drink.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Tarif €</mat-label>
                <input matInput type="number" [formControlName]="'drinkPrice' + i" step="0.01" min="0" />
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" [formControlName]="'drinkQuantity' + i" min="0" />
              </mat-form-field>
            </div>

            <div class="add-inline-row">
              <mat-form-field class="inline-field">
                <mat-label>Nouvelle boisson</mat-label>
                <input matInput [(ngModel)]="newDrinkName" [ngModelOptions]="{standalone: true}" name="newDrinkName" placeholder="Nom de la boisson" />
              </mat-form-field>
              <button mat-stroked-button type="button" (click)="onAddCatalogItem('drink', newDrinkName)">
                <mat-icon>add</mat-icon>
                Ajouter
              </button>
            </div>

            <!-- Desserts Section -->
            <div class="section-title">Desserts</div>
            <div *ngFor="let i of [0, 1, 2]" class="item-group">
              <mat-form-field class="full-width">
                <mat-label>Dessert {{ i + 1 }}</mat-label>
                <mat-select [formControlName]="'dessert' + i">
                  <mat-option *ngFor="let dessert of desserts" [value]="dessert.name">
                    {{ dessert.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Tarif €</mat-label>
                <input matInput type="number" [formControlName]="'dessertPrice' + i" step="0.01" min="0" />
              </mat-form-field>

              <mat-form-field class="half-width">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" [formControlName]="'dessertQuantity' + i" min="0" />
              </mat-form-field>
            </div>

            <div class="add-inline-row">
              <mat-form-field class="inline-field">
                <mat-label>Nouveau dessert</mat-label>
                <input matInput [(ngModel)]="newDessertName" [ngModelOptions]="{standalone: true}" name="newDessertName" placeholder="Nom du dessert" />
              </mat-form-field>
              <button mat-stroked-button type="button" (click)="onAddCatalogItem('dessert', newDessertName)">
                <mat-icon>add</mat-icon>
                Ajouter
              </button>
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

    .add-inline-row {
      display: flex;
      gap: 0.8rem;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .inline-field {
      flex: 1;
      min-width: 180px;
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly catalogService = inject(CatalogService);

  saleForm!: FormGroup;
  dishes: Array<{ name: string }> = [];
  drinks: Array<{ name: string }> = [];
  desserts: Array<{ name: string }> = [];
  users: Array<{ firstName: string }> = [];

  newSellerName = '';
  newSellerPhone = '';
  newDishName = '';
  newDrinkName = '';
  newDessertName = '';

  ngOnInit() {
    this.initializeForm();
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
      this.loadCatalog();
      return;
    }

    this.users = MOCK_USERS;
    this.dishes = MOCK_DISHES.map((d) => ({ name: d.name }));
    this.drinks = MOCK_DRINKS.map((d) => ({ name: d.name }));
    this.desserts = MOCK_DESSERTS.map((d) => ({ name: d.name }));
  }

  private loadUsers() {
    this.authService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  private loadCatalog() {
    this.catalogService.getItemsByCategory('dish').subscribe((items) => {
      this.dishes = items.length > 0 ? items : MOCK_DISHES.map((d) => ({ name: d.name }));
    });
    this.catalogService.getItemsByCategory('drink').subscribe((items) => {
      this.drinks = items.length > 0 ? items : MOCK_DRINKS.map((d) => ({ name: d.name }));
    });
    this.catalogService.getItemsByCategory('dessert').subscribe((items) => {
      this.desserts = items.length > 0 ? items : MOCK_DESSERTS.map((d) => ({ name: d.name }));
    });
  }

  onAddSeller() {
    const firstName = this.newSellerName.trim();
    const phoneNumber = this.newSellerPhone.trim();

    if (!firstName || !phoneNumber) {
      alert('Veuillez saisir le prénom et le téléphone de la vendeuse.');
      return;
    }

    this.authService.createUser(firstName, phoneNumber).subscribe({
      next: () => {
        this.newSellerName = '';
        this.newSellerPhone = '';
        this.loadUsers();
      },
      error: () => {
        alert('Impossible d\'ajouter cette vendeuse. Vérifiez les informations.');
      }
    });
  }

  onAddCatalogItem(category: CatalogCategory, itemName: string) {
    const name = itemName.trim();
    if (!name) {
      return;
    }

    this.catalogService.createItem(name, category).subscribe({
      next: () => {
        if (category === 'dish') this.newDishName = '';
        if (category === 'drink') this.newDrinkName = '';
        if (category === 'dessert') this.newDessertName = '';
        this.loadCatalog();
      },
      error: () => {
        alert('Impossible d\'ajouter cet élément au catalogue.');
      }
    });
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
