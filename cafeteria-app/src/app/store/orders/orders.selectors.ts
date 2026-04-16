import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState } from './orders.reducer';
import { OrderItem } from '../../core/models';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectOrderItems = createSelector(
  selectOrdersState,
  (state) => state.items
);

export const selectOrderTotal = createSelector(
  selectOrderItems,
  (items: OrderItem[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const selectSelectedPaymentMethod = createSelector(
  selectOrdersState,
  (state) => state.selectedPaymentMethod
);

export const selectIsOrderValid = createSelector(
  selectOrdersState,
  (state) => state.isValid
);

export const selectOrderItemCount = createSelector(
  selectOrderItems,
  (items) => items.length
);

export const selectOrderByCategory = (category: 'dish' | 'drink' | 'dessert') =>
  createSelector(selectOrderItems, (items) =>
    items.filter((item) => item.category === category)
  );
