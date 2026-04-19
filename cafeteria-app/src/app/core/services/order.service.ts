import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order, OrderItem, PaymentBreakdown, PaymentMethod } from '../models';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(
    saleCode: string,
    items: OrderItem[],
    paymentMethod: PaymentMethod,
    customerFirstName: string,
    paymentBreakdown?: PaymentBreakdown
  ): Observable<Order> {
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
