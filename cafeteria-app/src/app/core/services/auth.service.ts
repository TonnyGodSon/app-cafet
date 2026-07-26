import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User, MOCK_USERS } from '../models';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  authenticateUser(firstName: string, phoneNumber: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/login`, {}, {
      params: { firstName, phoneNumber }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return of(null); // mauvais identifiants
        }
        // erreur réseau / CORS / serveur → on propage avec message lisible
        return throwError(() => new Error(
          error.status === 0
            ? 'Impossible de joindre le serveur. Réessayez dans quelques instants.'
            : `Erreur serveur (${error.status})`
        ));
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(() => of(MOCK_USERS))
    );
  }

  createUser(firstName: string, phoneNumber: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, {
      firstName,
      phoneNumber
    });
  }
}

