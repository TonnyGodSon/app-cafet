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
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../store/auth/auth.selectors';
import * as SalesActions from '../../store/sales/sales.actions';
import { selectIsSaleActive } from '../../store/sales/sales.selectors';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="brand-banner">
            <img src="assets/brand/logo-food.svg" alt="Logo CaFaith Normandie" />
            <div>
              <div class="title">CaFaith Normandie</div>
              <div class="subtitle">Connexion Cafétéria</div>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onLogin()">
            <mat-form-field class="full-width">
              <mat-label>Prénom</mat-label>
              <input
                matInput
                [(ngModel)]="firstName"
                name="firstName"
                placeholder="Entrez votre prénom"
              />
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Téléphone</mat-label>
              <input
                matInput
                [(ngModel)]="phoneNumber"
                name="phoneNumber"
                placeholder="0123456789"
                maxlength="10"
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
              [disabled]="(isLoading$ | async) || !isFormValid()"
            >
              <mat-spinner
                *ngIf="isLoading$ | async"
                diameter="20"
              ></mat-spinner>
              Connexion
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #fff6e9, #eaf5ff 55%, #f5edff);
      padding: 1rem;
    }
    .login-card {
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
    .error-message {
      color: #f44336;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background-color: #ffebee;
      border-radius: 4px;
    }
    mat-spinner {
      margin-right: 0.5rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  firstName = '';
  phoneNumber = '';
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  isSaleActive$!: Observable<boolean>;

  ngOnInit() {
    this.isLoading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isSaleActive$ = this.store.select(selectIsSaleActive);
    this.store.dispatch(AuthActions.loadUsers());
  }

  onLogin() {
    if (this.isFormValid()) {
      this.store.dispatch(
        AuthActions.login({
          firstName: this.firstName,
          phoneNumber: this.phoneNumber
        })
      );
    }
  }

  isFormValid(): boolean {
    return this.firstName.trim().length > 0 && this.phoneNumber.length === 10;
  }
}
