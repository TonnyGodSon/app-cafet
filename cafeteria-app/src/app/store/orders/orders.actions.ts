import { createAction, props } from '@ngrx/store';
import { Order, OrderItem, PaymentBreakdown, PaymentMethod } from '../../core/models';

export const addItem = createAction(
  '[Order] Add Item',
  props<{ item: OrderItem }>()
);

export const removeItem = createAction(
  '[Order] Remove Item',
  props<{ productId: string }>()
);

export const updateItemQuantity = createAction(
  '[Order] Update Item Quantity',
  props<{ productId: string; quantity: number }>()
);

export const setPaymentMethod = createAction(
  '[Order] Set Payment Method',
  props<{ method: PaymentMethod }>()
);

export const validateOrder = createAction('[Order] Validate Order');

export const submitOrder = createAction(
  '[Order] Submit Order',
  props<{ saleCode: string; customerFirstName: string; paymentMethod: PaymentMethod; paymentBreakdown?: PaymentBreakdown }>()
);

export const submitOrderSuccess = createAction(
  '[Order] Submit Order Success',
  props<{ order: Order }>()
);

export const submitOrderFailure = createAction(
  '[Order] Submit Order Failure',
  props<{ error: string }>()
);

export const clearOrder = createAction('[Order] Clear Order');
