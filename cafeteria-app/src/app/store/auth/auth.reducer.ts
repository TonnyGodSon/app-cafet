import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  users: [],
  isLoading: false,
  error: null,
  isAuthenticated: false
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    isLoading: false,
    isAuthenticated: true
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isAuthenticated: false
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    currentUser: null,
    isAuthenticated: false
  })),
  on(AuthActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users
  })),
  on(AuthActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
