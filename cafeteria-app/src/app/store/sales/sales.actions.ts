import { createAction, props } from '@ngrx/store';
import { Sale } from '../../core/models';

export const createSale = createAction(
  '[Sale] Create Sale',
  props<{ sale: Sale }>()
);

export const createSaleSuccess = createAction(
  '[Sale] Create Sale Success',
  props<{ sale: Sale }>()
);

export const createSaleFailure = createAction(
  '[Sale] Create Sale Failure',
  props<{ error: string }>()
);

export const joinSale = createAction(
  '[Sale] Join Sale',
  props<{ saleCode: string }>()
);

export const joinSaleSuccess = createAction(
  '[Sale] Join Sale Success',
  props<{ sale: Sale }>()
);

export const joinSaleFailure = createAction(
  '[Sale] Join Sale Failure',
  props<{ error: string }>()
);

export const closeSale = createAction(
  '[Sale] Close Sale',
  props<{ saleCode: string }>()
);

export const closeSaleSuccess = createAction(
  '[Sale] Close Sale Success',
  props<{ sale: Sale }>()
);

export const closeSaleFailure = createAction(
  '[Sale] Close Sale Failure',
  props<{ error: string }>()
);

export const loadActiveSale = createAction(
  '[Sale] Load Active Sale'
);

export const loadActiveSaleSuccess = createAction(
  '[Sale] Load Active Sale Success',
  props<{ sale: Sale }>()
);

export const loadActiveSaleFailure = createAction(
  '[Sale] Load Active Sale Failure',
  props<{ error: string }>()
);
