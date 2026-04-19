import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

type PaymentMethodLabel = 'CB' | 'PayPal' | 'Wero' | 'Espèces';

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
              [disabled]="isPdfLoading || isExcelLoading"
            >
              <mat-icon *ngIf="!isPdfLoading">picture_as_pdf</mat-icon>
              <mat-spinner *ngIf="isPdfLoading" diameter="20"></mat-spinner>
              Générer Rapport PDF
            </button>

            <button
              mat-raised-button
              color="accent"
              class="full-width excel-btn"
              (click)="onGenerateExcel()"
              [disabled]="isPdfLoading || isExcelLoading"
            >
              <mat-icon *ngIf="!isExcelLoading">table_chart</mat-icon>
              <mat-spinner *ngIf="isExcelLoading" diameter="20"></mat-spinner>
              Générer Rapport Excel
            </button>

            <button
              mat-raised-button
              class="full-width mail-btn"
              (click)="onSendEmail()"
            >
              <mat-icon>mail</mat-icon>
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

    .excel-btn {
      background-color: #1d7a45 !important;
      color: #fff !important;
    }

    .mail-btn {
      background-color: #5b6bbf !important;
      color: #fff !important;
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  saleCode$!: Observable<string | null>;
  activeSale$!: Observable<Sale | null>;
  totalOrders$!: Observable<number>;
  isPdfLoading = false;
  isExcelLoading = false;
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
    this.isPdfLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const saleCode = await firstValueFrom(this.saleCode$);
      const activeSale = await firstValueFrom(this.activeSale$);

      if (!saleCode) {
        this.errorMessage = 'Aucune vente active trouvée.';
        this.isPdfLoading = false;
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
      const paymentMethods: PaymentMethodLabel[] = ['CB', 'PayPal', 'Wero', 'Espèces'];

      const getBreakdownEntries = (order: Order): Array<[PaymentMethodLabel, number]> => {
        const record = order.paymentBreakdown || {};
        return paymentMethods
          .map((method) => [method, Number(record[method] || 0)] as [PaymentMethodLabel, number])
          .filter(([, amount]) => amount > 0);
      };

      const paymentDisplay = (order: Order) => {
        if (order.paymentMethod !== 'Mixte') {
          return order.paymentMethod;
        }

        const entries = getBreakdownEntries(order);
        if (entries.length === 0) {
          return 'Mixte';
        }

        const details = entries
          .map(([method, amount]) => `${method} ${formatMoney(amount)}`)
          .join(' | ');
        return `Mixte (${details})`;
      };

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
            paymentDisplay(order),
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
      const paymentCountByMethod: Record<string, number> = {
        CB: 0,
        PayPal: 0,
        Wero: 0,
        Espèces: 0
      };
      const dishCounts: Record<string, number> = {};
      const drinkCounts: Record<string, number> = {};
      const dessertCounts: Record<string, number> = {};

      let totalRevenue = 0;

      orders.forEach((order) => {
        const sellerName = order.sellerName || sellerFallback;
        salesBySeller[sellerName] = (salesBySeller[sellerName] || 0) + order.totalPrice;

        const splitEntries = getBreakdownEntries(order);
        if (splitEntries.length > 0) {
          splitEntries.forEach(([method, amount]) => {
            salesByPayment[method] = (salesByPayment[method] || 0) + amount;
            paymentCountByMethod[method] = (paymentCountByMethod[method] || 0) + 1;
          });
        } else {
          const method = order.paymentMethod as string;
          salesByPayment[method] = (salesByPayment[method] || 0) + order.totalPrice;
          if (method in paymentCountByMethod) {
            paymentCountByMethod[method] = (paymentCountByMethod[method] || 0) + 1;
          }
        }

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
        head: [['Nombre de paiements par moyen de paiement', 'Nombre']],
        body: buildRows(paymentCountByMethod),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' }
        }
      });

      autoTable(doc, {
        startY: getNextY(80),
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
        startY: getNextY(90),
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
        startY: getNextY(100),
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
        startY: getNextY(110),
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
      this.isPdfLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Erreur lors de la génération du PDF';
      this.isPdfLoading = false;
      this.cdr.detectChanges();
    }
  }

  async onGenerateExcel() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isExcelLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const ExcelJS = await import('exceljs');
      const saleCode = await firstValueFrom(this.saleCode$);
      const activeSale = await firstValueFrom(this.activeSale$);

      if (!saleCode) {
        this.errorMessage = 'Aucune vente active trouvée.';
        this.isExcelLoading = false;
        this.cdr.detectChanges();
        return;
      }

      const orders = await firstValueFrom(this.orderService.getOrdersBySaleCode(saleCode));
      const sellerFallback = activeSale?.sellerName || '-';
      const paymentMethods: PaymentMethodLabel[] = ['CB', 'PayPal', 'Wero', 'Espèces'];
      const formatMoney = (v: number) => parseFloat(v.toFixed(2));

      const getBreakdownEntries = (order: Order): Array<[PaymentMethodLabel, number]> => {
        const record = order.paymentBreakdown || {};
        return paymentMethods
          .map((method) => [method, Number(record[method] || 0)] as [PaymentMethodLabel, number])
          .filter(([, amount]) => amount > 0);
      };

      const paymentDisplay = (order: Order): string => {
        if (order.paymentMethod !== 'Mixte') return order.paymentMethod;
        const entries = getBreakdownEntries(order);
        if (entries.length === 0) return 'Mixte';
        return `Mixte (${entries.map(([m, a]) => `${m} ${a.toFixed(2)}€`).join(' | ')})`;
      };

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'CaFaith Normandie';
      workbook.created = new Date();
      const sheet = workbook.addWorksheet('Rapport vente');

      // Largeur fixe par colonne pour garder un rapport lisible en un seul onglet.
      sheet.columns = [
        { width: 32 },
        { width: 58 },
        { width: 18 },
        { width: 36 },
        { width: 24 }
      ];

      const writeSection = (
        sectionTitle: string,
        headers: string[],
        rows: Array<Array<string | number>>,
        titleArgb: string,
        headerArgb: string,
        startRow: number
      ): number => {
        const titleCell = sheet.getCell(startRow, 1);
        titleCell.value = sectionTitle;
        titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: titleArgb } };
        titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
        sheet.mergeCells(startRow, 1, startRow, Math.max(headers.length, 5));
        sheet.getRow(startRow).height = 22;

        const headerRowNumber = startRow + 1;
        headers.forEach((header, idx) => {
          const cell = sheet.getCell(headerRowNumber, idx + 1);
          cell.value = header;
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerArgb } };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        const safeRows = rows.length > 0 ? rows : [['Aucune donnée', '-']];
        let currentRow = headerRowNumber;
        safeRows.forEach((row) => {
          currentRow += 1;
          row.forEach((value, idx) => {
            const cell = sheet.getCell(currentRow, idx + 1);
            cell.value = value as any;
            cell.alignment = {
              vertical: 'middle',
              horizontal: typeof value === 'number' ? 'right' : 'left'
            };
          });
        });

        // Bordures sur l'ensemble du bloc.
        for (let r = headerRowNumber; r <= currentRow; r++) {
          for (let c = 1; c <= headers.length; c++) {
            sheet.getCell(r, c).border = {
              top: { style: 'thin', color: { argb: 'FFD9DFEE' } },
              left: { style: 'thin', color: { argb: 'FFD9DFEE' } },
              bottom: { style: 'thin', color: { argb: 'FFD9DFEE' } },
              right: { style: 'thin', color: { argb: 'FFD9DFEE' } }
            };
          }
        }

        return currentRow + 2;
      };

      let nextRow = 1;

      // Agrégats
      const salesBySeller: Record<string, number> = {};
      const salesByPayment: Record<string, number> = {};
      const paymentCountByMethod: Record<string, number> = { CB: 0, PayPal: 0, Wero: 0, 'Espèces': 0 };
      const dishCounts: Record<string, number> = {};
      const drinkCounts: Record<string, number> = {};
      const dessertCounts: Record<string, number> = {};
      let totalRevenue = 0;

      orders.forEach(order => {
        const seller = order.sellerName || sellerFallback;
        salesBySeller[seller] = (salesBySeller[seller] || 0) + order.totalPrice;
        const entries = getBreakdownEntries(order);
        if (entries.length > 0) {
          entries.forEach(([method, amount]) => {
            salesByPayment[method] = (salesByPayment[method] || 0) + amount;
            paymentCountByMethod[method] = (paymentCountByMethod[method] || 0) + 1;
          });
        } else {
          const m = order.paymentMethod as string;
          salesByPayment[m] = (salesByPayment[m] || 0) + order.totalPrice;
          if (m in paymentCountByMethod) paymentCountByMethod[m] = (paymentCountByMethod[m] || 0) + 1;
        }
        totalRevenue += order.totalPrice;
        order.items.forEach(item => {
          if (item.category === 'dish') dishCounts[item.productName] = (dishCounts[item.productName] || 0) + item.quantity;
          if (item.category === 'drink') drinkCounts[item.productName] = (drinkCounts[item.productName] || 0) + item.quantity;
          if (item.category === 'dessert') dessertCounts[item.productName] = (dessertCounts[item.productName] || 0) + item.quantity;
        });
      });

      const toRows = (rec: Record<string, number>) =>
        Object.entries(rec).sort((a, b) => b[1] - a[1]).map(([label, value]) => [label, formatMoney(value)] as Array<string | number>);

      nextRow = writeSection(
        'Détail des commandes',
        ['Client', 'Commandes', 'Total (€)', 'Moyen de paiement', 'Vendeur'],
        orders.map((o) => [
          o.customerFirstName || '-',
          o.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ') || '-',
          formatMoney(o.totalPrice),
          paymentDisplay(o),
          o.sellerName || sellerFallback
        ]),
        'FF2C3E50',
        'FF34495E',
        nextRow
      );

      nextRow = writeSection(
        'Total des ventes par vendeur',
        ['Vendeur', 'Montant (€)'],
        toRows(salesBySeller),
        'FF2471A3',
        'FF2980B9',
        nextRow
      );

      nextRow = writeSection(
        'Total des ventes par moyen de paiement',
        ['Moyen de paiement', 'Montant (€)'],
        toRows(salesByPayment),
        'FF1D8348',
        'FF27AE60',
        nextRow
      );

      nextRow = writeSection(
        'Nombre de paiements par moyen',
        ['Moyen de paiement', 'Nombre'],
        toRows(paymentCountByMethod),
        'FF117A65',
        'FF16A085',
        nextRow
      );

      nextRow = writeSection(
        'Nombre de plats vendus par plat',
        ['Plat', 'Quantité'],
        toRows(dishCounts),
        'FF7D3C98',
        'FF8E44AD',
        nextRow
      );

      nextRow = writeSection(
        'Nombre de boissons vendues par type',
        ['Boisson', 'Quantité'],
        toRows(drinkCounts),
        'FFAF601A',
        'FFD68910',
        nextRow
      );

      nextRow = writeSection(
        'Nombre de desserts vendus par type',
        ['Dessert', 'Quantité'],
        toRows(dessertCounts),
        'FF922B21',
        'FFC0392B',
        nextRow
      );

      writeSection(
        'Récapitulatif',
        ['Indicateur', 'Valeur'],
        [
          ['Code vente', saleCode],
          ['Date', this.getCurrentDate()],
          ['Nombre de commandes', orders.length],
          ['Recette du jour (€)', formatMoney(totalRevenue)]
        ],
        'FF212F3D',
        'FF2C3E50',
        nextRow
      );

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_vente_${saleCode}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      this.successMessage = 'Rapport Excel généré et téléchargé avec succès!';
      this.isExcelLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Erreur lors de la génération du fichier Excel';
      this.isExcelLoading = false;
      this.cdr.detectChanges();
    }
  }

  onSendEmail() {

    const today = new Date();
    const dateFormatted = today.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit'
    });
    const dateFr = today.toLocaleDateString('fr-FR');

    const subject = encodeURIComponent(`Rapport de vente de la cafétéria datant du ${dateFr}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver ci-joint le rapport de votre vente datant du ${dateFormatted}.\n\nCordialement,\nCaFaith Normandie`
    );

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    this.successMessage = 'Client mail ouvert avec succès.';
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
