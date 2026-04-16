import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order, OrderItem, PaymentMethod } from '../models';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(
    saleCode: string,
    items: OrderItem[],
    paymentMethod: PaymentMethod,
    customerFirstName: string
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
      paymentMethod
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
