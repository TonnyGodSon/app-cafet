import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Observable, firstValueFrom } from 'rxjs';
import { selectActiveSale, selectActiveSaleCode } from '../../store/sales/sales.selectors';
import { SaleService, OrderService } from '../../core/services';
import * as AuthActions from '../../store/auth/auth.actions';
import { Order, Sale } from '../../core/models';

@Component({
  selector: 'app-close-sale',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="close-sale-container">
      <mat-card class="close-sale-card">
        <mat-card-header>
          <div class="brand-banner">
            <img src="assets/brand/logo-food.svg" alt="Logo CaFaith Normandie" />
            <div>
              <div class="title">CaFaith Normandie</div>
              <div class="subtitle">Fermeture de la vente du jour</div>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div class="sale-info" *ngIf="saleCode$ | async as saleCode">
            <p><strong>Code Vente:</strong> {{ saleCode }}</p>
            <p><strong>Date:</strong> {{ getCurrentDate() }}</p>
            <p *ngIf="totalOrders$ | async as total"><strong>Nombre de Commandes:</strong> {{ total }}</p>
          </div>

          <div class="actions">
            <button
              mat-raised-button
              color="primary"
              class="full-width"
              (click)="onGeneratePDF()"
              [disabled]="isLoading"
            >
              <mat-icon *ngIf="!isLoading">picture_as_pdf</mat-icon>
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              Générer Rapport PDF
            </button>

            <button
              mat-raised-button
              color="accent"
              class="full-width"
              (click)="onSendEmail()"
              [disabled]="isLoading"
            >
              <mat-icon *ngIf="!isLoading">mail</mat-icon>
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              Envoyer par Mail
            </button>

            <button
              mat-raised-button
              color="warn"
              class="full-width"
              (click)="onLogout()"
            >
              <mat-icon>exit_to_app</mat-icon>
              Se Déconnecter
            </button>
          </div>

          <div *ngIf="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .close-sale-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #fff6e9, #eaf5ff 55%, #f5edff);
      padding: 1rem;
    }

    .close-sale-card {
      width: 100%;
      max-width: 560px;
      padding: 1.7rem;
      border-radius: 20px;
      border: 1px solid #e8ebf7;
      box-shadow: 0 16px 30px rgba(40, 51, 86, 0.12);
    }

    .sale-info {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .sale-info p {
      margin: 0.5rem 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .full-width {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
    }

    .success-message {
      color: #4caf50;
      background-color: #f1f8f4;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .error-message {
      color: #f44336;
      background-color: #ffebee;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    mat-spinner {
      margin-right: 0.5rem;
    }
  `]
})
export class CloseSaleComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly saleService = inject(SaleService);
  private readonly orderService = inject(OrderService);

  saleCode$!: Observable<string | null>;
  activeSale$!: Observable<Sale | null>;
  totalOrders$!: Observable<number>;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.saleCode$ = this.store.select(selectActiveSaleCode);
    this.activeSale$ = this.store.select(selectActiveSale);
    this.totalOrders$ = new Observable(observer => {
      this.saleCode$.subscribe(saleCode => {
        if (saleCode) {
          this.orderService.getOrdersBySaleCode(saleCode).subscribe(orders => {
            observer.next(orders.length);
          });
        }
      });
    });
  }

  async onGeneratePDF() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const saleCode = await firstValueFrom(this.saleCode$);
      const activeSale = await firstValueFrom(this.activeSale$);

      if (!saleCode) {
        this.errorMessage = 'Aucune vente active trouvée.';
        this.isLoading = false;
        return;
      }

      const orders = await firstValueFrom(this.orderService.getOrdersBySaleCode(saleCode));

      const doc = new jsPDF();
      const formatMoney = (value: number) => `${value.toFixed(2)} EUR`;
      const sellerFallback = activeSale?.sellerName || '-';

      const itemLabel = (order: Order) =>
        order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ') || '-';

      const buildRows = (record: Record<string, number>, isCurrency = false) => {
        const entries = Object.entries(record);
        if (entries.length === 0) {
          return [['Aucune donnée', '-']];
        }

        return entries
          .sort((a, b) => b[1] - a[1])
          .map(([label, value]) => [label, isCurrency ? formatMoney(value) : String(value)]);
      };

      const getNextY = (defaultY: number) => {
        const lastTable = (doc as any).lastAutoTable;
        if (!lastTable || !lastTable.finalY) {
          return defaultY;
        }
        return lastTable.finalY + 10;
      };

      const pageWidth = doc.internal.pageSize.getWidth();

      const drawFoodLogo = (x: number, y: number) => {
        doc.setFillColor(255, 207, 135);
        doc.roundedRect(x, y, 16, 16, 3, 3, 'F');
        doc.setDrawColor(63, 74, 103);
        doc.setLineWidth(0.8);
        doc.line(x + 5, y + 4, x + 5, y + 12);
        doc.line(x + 8, y + 4, x + 8, y + 7);
        doc.line(x + 10, y + 4, x + 10, y + 7);
        doc.line(x + 12, y + 4, x + 12, y + 7);
        doc.line(x + 14, y + 4, x + 14, y + 12);
      };

      const drawHeader = () => {
        drawFoodLogo(14, 8);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('CaFaith Normandie', 34, 15);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Rapport de vente du jour', pageWidth / 2, 22, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Code vente: ${saleCode}`, 14, 31);
        doc.text(`Date: ${this.getCurrentDate()}`, 14, 37);
      };

      drawHeader();

      const ordersRows = orders.length > 0
        ? orders.map((order) => [
            order.customerFirstName || '-',
            itemLabel(order),
            formatMoney(order.totalPrice),
            order.paymentMethod,
            order.sellerName || sellerFallback
          ])
        : [['Aucune commande', '-', '-', '-', '-']];

      autoTable(doc, {
        startY: 45,
        head: [['Client', 'Commandes', 'Total', 'Moyen de paiement', 'Vendeur']],
        body: ordersRows,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 70 },
          2: { cellWidth: 25, halign: 'right' },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 }
        },
        didDrawPage: () => {
          const pageNumber = doc.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(9);
          doc.text(`Page ${pageNumber}`, pageWidth - 12, pageHeight - 8, { align: 'right' });
        }
      });

      const salesBySeller: Record<string, number> = {};
      const salesByPayment: Record<string, number> = {};
      const dishCounts: Record<string, number> = {};
      const drinkCounts: Record<string, number> = {};
      const dessertCounts: Record<string, number> = {};

      let totalRevenue = 0;

      orders.forEach((order) => {
        const sellerName = order.sellerName || sellerFallback;
        salesBySeller[sellerName] = (salesBySeller[sellerName] || 0) + order.totalPrice;
        salesByPayment[order.paymentMethod] = (salesByPayment[order.paymentMethod] || 0) + order.totalPrice;
        totalRevenue += order.totalPrice;

        order.items.forEach((item) => {
          if (item.category === 'dish') {
            dishCounts[item.productName] = (dishCounts[item.productName] || 0) + item.quantity;
          }
          if (item.category === 'drink') {
            drinkCounts[item.productName] = (drinkCounts[item.productName] || 0) + item.quantity;
          }
          if (item.category === 'dessert') {
            dessertCounts[item.productName] = (dessertCounts[item.productName] || 0) + item.quantity;
          }
        });
      });

      autoTable(doc, {
        startY: getNextY(50),
        head: [['Total des ventes du jour par vendeur', 'Montant']],
        body: buildRows(salesBySeller, true),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      autoTable(doc, {
        startY: getNextY(60),
        head: [['Total de vente par moyen de paiement', 'Montant']],
        body: buildRows(salesByPayment, true),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      autoTable(doc, {
        startY: getNextY(70),
        head: [['Nombre de plats vendus par plat', 'Quantité']],
        body: buildRows(dishCounts),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [142, 68, 173], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      autoTable(doc, {
        startY: getNextY(80),
        head: [['Nombre de boissons vendues par type de boisson', 'Quantité']],
        body: buildRows(drinkCounts),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [211, 84, 0], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      autoTable(doc, {
        startY: getNextY(90),
        head: [['Nombre de desserts vendus par type de dessert', 'Quantité']],
        body: buildRows(dessertCounts),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [192, 57, 43], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      autoTable(doc, {
        startY: getNextY(100),
        head: [['Recette du jour']],
        body: [[formatMoney(totalRevenue)]],
        theme: 'grid',
        styles: { fontSize: 12, fontStyle: 'bold', halign: 'right' },
        headStyles: { fillColor: [44, 62, 80], textColor: 255, halign: 'center' },
        columnStyles: {
          0: { cellWidth: 170 }
        }
      });

      doc.save(`rapport_vente_${saleCode}.pdf`);
      this.successMessage = 'Rapport PDF généré et téléchargé avec succès!';
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Erreur lors de la génération du PDF';
      this.isLoading = false;
    }
  }

  onSendEmail() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.saleCode$.subscribe(saleCode => {
      if (saleCode) {
        try {
          // Mock email sending
          this.saleService.sendMailWithPDF('antoine.mvoumby@gmail.com', '').subscribe(
            () => {
              this.successMessage = 'Email envoyé avec succès à antoine.mvoumby@gmail.com!';
              this.isLoading = false;
            },
            () => {
              this.errorMessage = 'Erreur lors de l\'envoi de l\'email';
              this.isLoading = false;
            }
          );
        } catch (error) {
          this.errorMessage = 'Erreur lors de l\'envoi de l\'email';
          this.isLoading = false;
        }
      }
    });
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('fr-FR');
  }
}
