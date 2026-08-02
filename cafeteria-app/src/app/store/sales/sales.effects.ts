import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SaleService } from '../../core/services';
import * as SalesActions from './sales.actions';
import { Store } from '@ngrx/store';
import { selectActiveSale } from './sales.selectors';

@Injectable()
export class SalesEffects {
  private readonly actions$ = inject(Actions);
  private readonly saleService = inject(SaleService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

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
              return SalesActions.joinSaleFailure({
                error: 'Vente introuvable. Vérifiez le code ou votre connexion internet.'
              });
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
      withLatestFrom(this.store.select(selectActiveSale)),
      switchMap(([{ saleCode }, currentSale]) =>
        // On passe la vente courante afin que le mode hors-ligne puisse retourner
        // un objet Sale valide (status: 'closed') sans attendre le serveur.
        this.saleService.closeSale(saleCode, currentSale ?? undefined).pipe(
          map((closedSale) =>
            closedSale
              ? SalesActions.closeSaleSuccess({ sale: closedSale })
              : SalesActions.closeSaleFailure({ error: 'Impossible de clôturer la vente' })
          ),
          catchError((error) =>
            of(SalesActions.closeSaleFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
