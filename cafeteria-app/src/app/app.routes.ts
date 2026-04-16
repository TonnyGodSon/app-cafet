import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { JoinSaleComponent } from './features/join-sale/join-sale.component';
import { CreateSaleComponent } from './features/create-sale/create-sale.component';
import { SaleDisplayComponent } from './features/sale-display/sale-display.component';
import { CloseSaleComponent } from './features/close-sale/close-sale.component';

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
    component: JoinSaleComponent
  },
  {
    path: 'create-sale',
    component: CreateSaleComponent
  },
  {
    path: 'sale-display',
    component: SaleDisplayComponent
  },
  {
    path: 'close-sale',
    component: CloseSaleComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
