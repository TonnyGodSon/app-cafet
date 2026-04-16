import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { OrderService } from '../../core/services';
import * as OrdersActions from './orders.actions';
import { Store } from '@ngrx/store';
import { selectOrderItems } from './orders.selectors';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly orderService = inject(OrderService);
  private readonly store = inject(Store);

  submitOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.submitOrder),
      withLatestFrom(this.store.select(selectOrderItems)),
      switchMap(([{ saleCode, customerFirstName, paymentMethod }, items]) => {
        return this.orderService.createOrder(
          saleCode,
          items,
          paymentMethod,
          customerFirstName
        ).pipe(
          map((order) => OrdersActions.submitOrderSuccess({ order })),
          catchError((error) =>
            of(OrdersActions.submitOrderFailure({ error: error.message }))
          )
        );
      })
    )
  );

  submitOrderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrdersActions.submitOrderSuccess),
        map(() => OrdersActions.clearOrder())
      ),
    { dispatch: true }
  );
}
