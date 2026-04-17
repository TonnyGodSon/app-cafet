import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
      catchError(() => of(null))
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(() => of(MOCK_USERS))
    );
  }
}

