import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Sale, SaleDisplay } from '../models';
import { catchError, map } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:8080/api/sales';

  constructor(private http: HttpClient) {}

  generateSaleCode(): string {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }

  createSale(sale: Sale): Observable<Sale> {
    // Format date to ISO_DATE_TIME format (YYYY-MM-DDTHH:mm:ss)
    const dateObj = new Date(sale.date);
    const isoDate = dateObj.toISOString().split('.')[0]; // Remove milliseconds
    
    const request = {
      sellerName: sale.sellerName,
      saleDate: isoDate,
      dishes: (sale.dishes || []).map(item => ({ ...item, category: 'dish' })),
      drinks: (sale.drinks || []).map(item => ({ ...item, category: 'drink' })),
      desserts: (sale.desserts || []).map(item => ({ ...item, category: 'dessert' }))
    };
    return this.http.post<SaleApiResponse>(this.apiUrl, request).pipe(
      map((apiSale) => this.normalizeSale(apiSale)),
      catchError(error => {
        console.error('Error creating sale:', error);
        throw error;
      })
    );
  }

  getSaleByCode(saleCode: string): Observable<Sale | null> {
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

  closeSale(saleCode: string): Observable<Sale | null> {
    return this.http.put<SaleApiResponse>(`${this.apiUrl}/${saleCode}/close`, {}).pipe(
      map((apiSale) => this.normalizeSale(apiSale)),
      catchError(() => of(null))
    );
  }

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
      dishes: mapCategory('dish'),
      drinks: mapCategory('drink'),
      desserts: mapCategory('dessert'),
      createdAt: new Date(apiSale.saleDate),
      status: apiSale.status
    };
  }

  generatePDF(sale: Sale): Observable<string> {
    // Mock PDF generation - will be implemented in backend
    return of('base64-encoded-pdf-data');
  }

  sendMailWithPDF(email: string, pdfData: string): Observable<boolean> {
    // Mock email sending - will be implemented in backend
    console.log(`Email sent to ${email} with PDF`);
    return of(true);
  }
}
