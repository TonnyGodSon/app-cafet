import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MOCK_DESSERTS, MOCK_DISHES, MOCK_DRINKS } from '../models';
import { environment } from '../../../environments/environment';

export type CatalogCategory = 'dish' | 'drink' | 'dessert';

export interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = `${environment.apiBaseUrl}/catalog/items`;

  constructor(private http: HttpClient) {}

  getItemsByCategory(category: CatalogCategory): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(this.apiUrl, { params: { category } }).pipe(
      catchError(() => {
        if (category === 'dish') {
          return of(MOCK_DISHES.map((item) => ({ id: item.id, name: item.name, category })));
        }
        if (category === 'drink') {
          return of(MOCK_DRINKS.map((item) => ({ id: item.id, name: item.name, category })));
        }
        return of(MOCK_DESSERTS.map((item) => ({ id: item.id, name: item.name, category })));
      })
    );
  }

  createItem(name: string, category: CatalogCategory): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(this.apiUrl, {
      name,
      category
    });
  }
}
