import { createReducer, on } from '@ngrx/store';
import { Sale } from '../../core/models';
import * as SalesActions from './sales.actions';

export interface SalesState {
  activeSale: Sale | null;
  isLoading: boolean;
  error: string | null;
}

export const initialSalesState: SalesState = {
  activeSale: null,
  isLoading: false,
  error: null
};

export const salesReducer = createReducer(
  initialSalesState,
  on(SalesActions.createSale, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(SalesActions.createSaleSuccess, (state, { sale }) => ({
    ...state,
    activeSale: sale,
    isLoading: false
  })),
  on(SalesActions.createSaleFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(SalesActions.joinSaleSuccess, (state, { sale }) => ({
    ...state,
    activeSale: sale,
    isLoading: false
  })),
  on(SalesActions.closeSaleSuccess, (state, { sale }) => ({
    ...state,
    activeSale: sale
  }))
);
