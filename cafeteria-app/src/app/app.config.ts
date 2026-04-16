import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authReducer } from './store/auth/auth.reducer';
import { salesReducer } from './store/sales/sales.reducer';
import { ordersReducer } from './store/orders/orders.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { SalesEffects } from './store/sales/sales.effects';
import { OrdersEffects } from './store/orders/orders.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(),
    provideEffects([AuthEffects, SalesEffects, OrdersEffects]),
    provideStore({
      auth: authReducer,
      sales: salesReducer,
      orders: ordersReducer
    })
  ]
};
