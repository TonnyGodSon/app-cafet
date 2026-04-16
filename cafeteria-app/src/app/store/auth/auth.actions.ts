import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models';

export const login = createAction(
  '[Auth] Login',
  props<{ firstName: string; phoneNumber: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const loadUsers = createAction('[Auth] Load Users');

export const loadUsersSuccess = createAction(
  '[Auth] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Auth] Load Users Failure',
  props<{ error: string }>()
);
