import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesState } from './sales.reducer';

export const selectSalesState = createFeatureSelector<SalesState>('sales');

export const selectActiveSale = createSelector(
  selectSalesState,
  (state) => state.activeSale
);

export const selectActiveSaleCode = createSelector(
  selectActiveSale,
  (sale) => sale?.saleCode || null
);

export const selectSalesLoading = createSelector(
  selectSalesState,
  (state) => state.isLoading
);

export const selectSalesError = createSelector(
  selectSalesState,
  (state) => state.error
);

export const selectIsSaleActive = createSelector(
  selectActiveSale,
  (sale) => !!sale && sale.status === 'open'
);
