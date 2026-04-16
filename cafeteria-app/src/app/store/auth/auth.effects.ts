import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ firstName, phoneNumber }) =>
        this.authService.authenticateUser(firstName, phoneNumber).pipe(
          map((user) => {
            if (user) {
              return AuthActions.loginSuccess({ user });
            } else {
              return AuthActions.loginFailure({ error: 'Invalid credentials' });
            }
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/join-sale']))
      ),
    { dispatch: false }
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUsers),
      switchMap(() =>
        this.authService.getUsers().pipe(
          map((users) => AuthActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(AuthActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
