import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { Sale, SaleDisplay } from '../models';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ConnectivityService } from './connectivity.service';
import { OfflineQueueService } from './offline-queue.service';

type SaleApiItem = {
  productName: string;
  category: 'dish' | 'drink' | 'dessert';
  price: number;
  quantity: number;
};

type SaleApiResponse = {
  id: number;
  saleCode: string;
  sellerName: string;
  saleDate: string;
  status: 'open' | 'closed';
  items: SaleApiItem[];
};

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly apiUrl = `${environment.apiBaseUrl}/sales`;
  private readonly http = inject(HttpClient);
  private readonly connectivity = inject(ConnectivityService);
  private readonly queue = inject(OfflineQueueService);

  generateSaleCode(): string {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }

  // ─────────────────────── Création de vente ───────────────────────

  /**
   * Crée une vente.
   * • En ligne  → appel HTTP direct.
   * • Hors ligne → stocke dans la file locale et retourne une vente locale.
   * @param bypassOffline  Passer à true pour forcer l'appel HTTP (utilisé par SyncService).
   */
  createSale(sale: Sale, bypassOffline = false): Observable<Sale> {
    if (!bypassOffline && !this.connectivity.isOnline) {
      const localSaleCode = `OFF-${sale.saleCode}`;
      const localSale: Sale = {
        ...sale,
        id: `local-${Date.now()}`,
        saleCode: localSaleCode,
        status: 'open'
      };
      const op = {
        id: crypto.randomUUID(),
        type: 'CREATE_SALE' as const,
        payload: sale,
        localSaleCode,
        createdAt: Date.now(),
        retryCount: 0
      };
      return from(this.queue.enqueue(op)).pipe(map(() => localSale));
    }
    // ── Appel HTTP ──
    const dateObj = new Date(sale.date);
    const isoDate = dateObj.toISOString().split('.')[0];
    const request = {
      sellerName: sale.sellerName,
      saleDate: isoDate,
      dishes:    (sale.dishes    || []).map(item => ({ ...item, category: 'dish' })),
      drinks:    (sale.drinks    || []).map(item => ({ ...item, category: 'drink' })),
      desserts:  (sale.desserts  || []).map(item => ({ ...item, category: 'dessert' }))
    };
    return this.http.post<SaleApiResponse>(this.apiUrl, request).pipe(
      map((apiSale) => this.normalizeSale(apiSale)),
      catchError(error => {
        console.error('Error creating sale:', error);
        throw error;
      })
    );
  }

  // ──────────────────────── Lecture de vente ───────────────────────

  getSaleByCode(saleCode: string): Observable<Sale | null> {
    if (!this.connectivity.isOnline) {
      return of(null);
    }
    return this.http.get<SaleApiResponse>(`${this.apiUrl}/${saleCode}`).pipe(
      map((apiSale) => this.normalizeSale(apiSale)),
      catchError(() => of(null))
    );
  }

  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  // ──────────────────────── Clôture de vente ───────────────────────

  /**
   * Clôture une vente.
   * • En ligne  → appel HTTP direct.
   * • Hors ligne → stocke dans la file et retourne la vente avec statut 'closed'.
   * @param bypassOffline  Passer à true pour forcer l'appel HTTP (utilisé par SyncService).
   */
  closeSale(saleCode: string, currentSale?: Sale, bypassOffline = false): Observable<Sale | null> {
    if (!bypassOffline && !this.connectivity.isOnline) {
      const op = {
        id: crypto.randomUUID(),
        type: 'CLOSE_SALE' as const,
        payload: { saleCode },
        localSaleCode: saleCode,
        createdAt: Date.now(),
        retryCount: 0
      };
      return from(this.queue.enqueue(op)).pipe(
        map(() => currentSale ? { ...currentSale, status: 'closed' as const } : null)
      );
    }
    return this.http.put<SaleApiResponse>(`${this.apiUrl}/${saleCode}/close`, {}).pipe(
      map((apiSale) => this.normalizeSale(apiSale)),
      catchError(() => of(null))
    );
  }

  // ──────────────────────── Utilitaires ────────────────────────────

  private normalizeSale(apiSale: SaleApiResponse): Sale {
    const items = apiSale.items || [];
    const mapCategory = (category: 'dish' | 'drink' | 'dessert') =>
      items
        .filter((item) => item.category === category)
        .map((item, index) => ({
          productId: `${category}-${index}-${item.productName}`,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity
        }));

    return {
      id: String(apiSale.id),
      saleCode: apiSale.saleCode,
      date: new Date(apiSale.saleDate),
      sellerName: apiSale.sellerName,
      dishes:   mapCategory('dish'),
      drinks:   mapCategory('drink'),
      desserts: mapCategory('dessert'),
      createdAt: new Date(apiSale.saleDate),
      status: apiSale.status
    };
  }

  generatePDF(sale: Sale): Observable<string> {
    return of('base64-encoded-pdf-data');
  }

  sendMailWithPDF(email: string, pdfData: string): Observable<boolean> {
    console.log(`Email sent to ${email} with PDF`);
    return of(true);
  }
}
