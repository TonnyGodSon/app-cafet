import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as SalesActions from '../../store/sales/sales.actions';
import { selectSalesError, selectSalesLoading, selectActiveSaleCode } from '../../store/sales/sales.selectors';

@Component({
  selector: 'app-join-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="join-sale-container">
      <mat-card class="join-sale-card">
        <mat-card-header>
          <div class="brand-banner">
            <img src="assets/brand/logo-food.svg" alt="Logo CaFaith Normandie" />
            <div>
              <div class="title">CaFaith Normandie</div>
              <div class="subtitle">Rejoindre une vente</div>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onJoinSale()">
            <mat-form-field class="full-width">
              <mat-label>Code Vente</mat-label>
              <input
                matInput
                [(ngModel)]="saleCode"
                name="saleCode"
                placeholder="0000"
                maxlength="4"
              />
            </mat-form-field>

            <div *ngIf="error$ | async as error" class="error-message">
              {{ error }}
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="(isLoading$ | async) || saleCode.length !== 4"
            >
              <mat-spinner *ngIf="isLoading$ | async" diameter="20"></mat-spinner>
              Rejoindre
            </button>

            <button
              mat-stroked-button
              color="accent"
              type="button"
              class="full-width mt-1"
              (click)="onCreateNewSale()"
            >
              Créer une Nouvelle Vente
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .join-sale-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #fff6e9, #eaf5ff 55%, #f5edff);
      padding: 1rem;
    }
    .join-sale-card {
      width: 100%;
      max-width: 430px;
      padding: 1.5rem;
      border-radius: 20px;
      border: 1px solid #e8ebf7;
      box-shadow: 0 16px 30px rgba(40, 51, 86, 0.12);
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .mt-1 {
      margin-top: 1rem;
    }
    .error-message {
      color: #f44336;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background-color: #ffebee;
      border-radius: 4px;
    }
  `]
})
export class JoinSaleComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  saleCode = '';
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  ngOnInit() {
    this.isLoading$ = this.store.select(selectSalesLoading);
    this.error$ = this.store.select(selectSalesError);
  }

  onJoinSale() {
    if (this.saleCode.length === 4) {
      this.store.dispatch(SalesActions.joinSale({ saleCode: this.saleCode }));
      // Navigation will be handled by the Effect after success
    }
  }

  onCreateNewSale() {
    this.router.navigate(['/create-sale']);
  }
}
