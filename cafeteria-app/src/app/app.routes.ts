import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { JoinSaleComponent } from './features/join-sale/join-sale.component';
import { CreateSaleComponent } from './features/create-sale/create-sale.component';
import { SaleDisplayComponent } from './features/sale-display/sale-display.component';
import { CloseSaleComponent } from './features/close-sale/close-sale.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'join-sale',
    component: JoinSaleComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create-sale',
    component: CreateSaleComponent,
    canActivate: [authGuard]
  },
  {
    path: 'sale-display',
    component: SaleDisplayComponent,
    canActivate: [authGuard]
  },
  {
    path: 'close-sale',
    component: CloseSaleComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
