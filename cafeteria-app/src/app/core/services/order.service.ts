import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { Order, OrderItem, PaymentBreakdown, PaymentMethod } from '../models';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ConnectivityService } from './connectivity.service';
import { OfflineQueueService } from './offline-queue.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.apiBaseUrl}/orders`;
  private readonly http = inject(HttpClient);
  private readonly connectivity = inject(ConnectivityService);
  private readonly queue = inject(OfflineQueueService);

  /**
   * Crée une commande.
   * • En ligne  → appel HTTP direct.
   * • Hors ligne → stocke dans la file locale et retourne une commande locale.
   * @param bypassOffline  Passer à true pour forcer l'appel HTTP (utilisé par SyncService).
   */
  createOrder(
    saleCode: string,
    items: OrderItem[],
    paymentMethod: PaymentMethod,
    customerFirstName: string,
    paymentBreakdown?: PaymentBreakdown,
    bypassOffline = false
  ): Observable<Order> {
    if (!bypassOffline && !this.connectivity.isOnline) {
      const localOrder: Order = {
        id: `local-${Date.now()}`,
        saleCode,
        customerFirstName,
        items,
        paymentMethod,
        paymentBreakdown,
        totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        createdAt: new Date()
      };
      const op = {
        id: crypto.randomUUID(),
        type: 'CREATE_ORDER' as const,
        payload: { saleCode, items, paymentMethod, customerFirstName, paymentBreakdown },
        createdAt: Date.now(),
        retryCount: 0
      };
      return from(this.queue.enqueue(op)).pipe(map(() => localOrder));
    }
    // ── Appel HTTP ──
    const request = {
      saleCode,
      customerFirstName,
      items: items.map(item => ({
        productName: item.productName,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      })),
      paymentMethod,
      paymentBreakdown
    };
    return this.http.post<Order>(this.apiUrl, request).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        throw error;
      })
    );
  }

  getOrdersBySaleCode(saleCode: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/sale/${saleCode}`).pipe(
      catchError(() => of([]))
    );
  }
}
