import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { SaleService } from '../../core/services';
import * as SalesActions from './sales.actions';

@Injectable()
export class SalesEffects {
  private readonly actions$ = inject(Actions);
  private readonly saleService = inject(SaleService);
  private readonly router = inject(Router);

  createSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.createSale),
      switchMap(({ sale }) =>
        this.saleService.createSale(sale).pipe(
          map((createdSale) => SalesActions.createSaleSuccess({ sale: createdSale })),
          catchError((error) =>
            of(SalesActions.createSaleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createSaleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SalesActions.createSaleSuccess),
        tap(() => this.router.navigate(['/sale-display']))
      ),
    { dispatch: false }
  );

  joinSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.joinSale),
      switchMap(({ saleCode }) =>
        this.saleService.getSaleByCode(saleCode).pipe(
          map((sale) => {
            if (sale) {
              return SalesActions.joinSaleSuccess({ sale });
            } else {
              return SalesActions.joinSaleFailure({ error: 'Sale not found' });
            }
          }),
          catchError((error) =>
            of(SalesActions.joinSaleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  joinSaleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SalesActions.joinSaleSuccess),
        tap(() => this.router.navigate(['/sale-display']))
      ),
    { dispatch: false }
  );

  closeSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.closeSale),
      switchMap(({ saleCode }) =>
        this.saleService.closeSale(saleCode).pipe(
          map((closedSale) => SalesActions.closeSaleSuccess({ sale: closedSale! })),
          catchError((error) =>
            of(SalesActions.closeSaleFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
