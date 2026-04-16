import { createReducer, on } from '@ngrx/store';
import { Order, OrderItem, PaymentMethod } from '../../core/models';
import * as OrdersActions from './orders.actions';

export interface OrdersState {
  items: OrderItem[];
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
}

export const initialOrdersState: OrdersState = {
  items: [],
  selectedPaymentMethod: null,
  isLoading: false,
  error: null,
  isValid: false
};

export const ordersReducer = createReducer(
  initialOrdersState,
  on(OrdersActions.addItem, (state, { item }) => {
    const existingItem = state.items.find(i => i.productId === item.productId);
    let newItems;
    if (existingItem) {
      newItems = state.items.map(i =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      newItems = [...state.items, item];
    }
    return {
      ...state,
      items: newItems,
      isValid: validateOrder(newItems, state.selectedPaymentMethod)
    };
  }),
  on(OrdersActions.removeItem, (state, { productId }) => {
    const newItems = state.items.filter(i => i.productId !== productId);
    return {
      ...state,
      items: newItems,
      isValid: validateOrder(newItems, state.selectedPaymentMethod)
    };
  }),
  on(OrdersActions.updateItemQuantity, (state, { productId, quantity }) => {
    const newItems = state.items.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    return {
      ...state,
      items: newItems,
      isValid: validateOrder(newItems, state.selectedPaymentMethod)
    };
  }),
  on(OrdersActions.setPaymentMethod, (state, { method }) => ({
    ...state,
    selectedPaymentMethod: method,
    isValid: validateOrder(state.items, method)
  })),
  on(OrdersActions.clearOrder, (state) => initialOrdersState)
);

function validateOrder(items: OrderItem[], paymentMethod: PaymentMethod | null): boolean {
  return items.length > 0 && paymentMethod !== null;
}
