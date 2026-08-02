import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, firstValueFrom } from 'rxjs';
import { ConnectivityService } from './connectivity.service';
import { OfflineQueueService, PendingOperation } from './offline-queue.service';
import { SaleService } from './sale.service';
import { OrderService } from './order.service';
import { Sale } from '../models/sale.model';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private readonly connectivity = inject(ConnectivityService);
  private readonly queue = inject(OfflineQueueService);
  private readonly saleService = inject(SaleService);
  private readonly orderService = inject(OrderService);

  private readonly _status$ = new BehaviorSubject<SyncStatus>('idle');
  private readonly _pendingCount$ = new BehaviorSubject<number>(0);

  /** Statut courant de la synchronisation */
  readonly status$: Observable<SyncStatus> = this._status$.asObservable();
  /** Nombre d'opérations en attente de sync */
  readonly pendingCount$: Observable<number> = this._pendingCount$.asObservable();

  private isSyncing = false;

  constructor() {
    // Dès que la connexion revient, on lance la synchronisation
    this.connectivity.isOnline$
      .pipe(filter((online) => online))
      .subscribe(() => this.syncAll());

    // Refresh du compteur au démarrage
    this.refreshCount();
  }

  async syncAll(): Promise<void> {
    if (this.isSyncing) return;

    const ops = await this.queue.getAll();
    if (ops.length === 0) {
      await this.refreshCount();
      return;
    }

    this.isSyncing = true;
    this._status$.next('syncing');
    this._pendingCount$.next(ops.length);

    let remaining = ops.length;
    let hasError = false;

    for (const op of ops) {
      try {
        await this.processOp(op);
        await this.queue.remove(op.id);
        remaining--;
        this._pendingCount$.next(remaining);
      } catch (err) {
        console.error('[Sync] Échec de synchronisation pour', op.type, err);
        hasError = true;
        break; // Conserver l'ordre des opérations
      }
    }

    this.isSyncing = false;

    if (hasError) {
      this._status$.next('error');
    } else {
      this._status$.next('success');
      setTimeout(() => {
        if (this._status$.value === 'success') {
          this._status$.next('idle');
        }
      }, 4000);
    }
  }

  async refreshCount(): Promise<void> {
    const count = await this.queue.count();
    this._pendingCount$.next(count);
  }

  // ─────────────────── Traitement d'une opération ───────────────────

  private async processOp(op: PendingOperation): Promise<void> {
    console.log(`[Sync] Traitement de l'opération : ${op.type}`, op.payload);

    if (op.type === 'CREATE_SALE') {
      // bypassOffline=true → force l'appel HTTP même si toujours "hors-ligne"
      const sale: Sale = await firstValueFrom(
        this.saleService.createSale(op.payload as Sale, true)
      );
      if (op.localSaleCode && sale?.saleCode) {
        await this.queue.setSaleCodeMapping(op.localSaleCode, sale.saleCode);
        console.log(`[Sync] Mapping code vente : ${op.localSaleCode} → ${sale.saleCode}`);
      }

    } else if (op.type === 'CREATE_ORDER') {
      const p = op.payload;
      // Résolution du vrai code vente (si la vente était aussi hors-ligne)
      const realSaleCode = await this.queue.getRealSaleCode(p.saleCode as string);
      await firstValueFrom(
        this.orderService.createOrder(
          realSaleCode,
          p.items,
          p.paymentMethod,
          p.customerFirstName,
          p.paymentBreakdown,
          true // bypassOffline
        )
      );

    } else if (op.type === 'CLOSE_SALE') {
      const realSaleCode = await this.queue.getRealSaleCode(
        (op.payload as { saleCode: string }).saleCode
      );
      await firstValueFrom(
        this.saleService.closeSale(realSaleCode, undefined, true /* bypassOffline */)
      );
    }
  }
}
