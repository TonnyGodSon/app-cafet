import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type PendingOpType = 'CREATE_SALE' | 'CREATE_ORDER' | 'CLOSE_SALE';

export interface PendingOperation {
  /** Identifiant unique local (UUID) */
  id: string;
  type: PendingOpType;
  /** Données brutes de l'opération */
  payload: any;
  /** Code vente local (préfixé OFF-) pour CREATE_SALE */
  localSaleCode?: string;
  createdAt: number;
  retryCount: number;
}

interface SaleCodeMapping {
  localCode: string;
  realCode: string;
}

@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  private readonly DB_NAME = 'cafet-offline-db';
  private readonly DB_VERSION = 1;
  private readonly OPS_STORE = 'pending_ops';
  private readonly MAP_STORE = 'sale_code_map';

  private dbPromise: Promise<IDBDatabase> | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  // ─────────────────────────── Init ────────────────────────────

  private getDb(): Promise<IDBDatabase> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('IndexedDB non disponible (SSR)'));
    }
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.OPS_STORE)) {
          db.createObjectStore(this.OPS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(this.MAP_STORE)) {
          db.createObjectStore(this.MAP_STORE, { keyPath: 'localCode' });
        }
      };

      req.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
      req.onerror = () => reject(req.error);
    });

    return this.dbPromise;
  }

  // ──────────────────── Opérations en attente ──────────────────

  async enqueue(op: PendingOperation): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.OPS_STORE, 'readwrite');
      const req = tx.objectStore(this.OPS_STORE).put(op);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAll(): Promise<PendingOperation[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.OPS_STORE, 'readonly');
        const req = tx.objectStore(this.OPS_STORE).getAll();
        req.onsuccess = () =>
          resolve(
            ((req.result as PendingOperation[]) ?? []).sort(
              (a, b) => a.createdAt - b.createdAt
            )
          );
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  async remove(id: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.OPS_STORE, 'readwrite');
      const req = tx.objectStore(this.OPS_STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async count(): Promise<number> {
    try {
      const ops = await this.getAll();
      return ops.length;
    } catch {
      return 0;
    }
  }

  // ──────────────────── Mapping code vente ─────────────────────

  async setSaleCodeMapping(localCode: string, realCode: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.MAP_STORE, 'readwrite');
      const req = tx.objectStore(this.MAP_STORE).put({ localCode, realCode } as SaleCodeMapping);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getRealSaleCode(localCode: string): Promise<string> {
    if (!localCode?.startsWith('OFF-')) return localCode;
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.MAP_STORE, 'readonly');
        const req = tx.objectStore(this.MAP_STORE).get(localCode);
        req.onsuccess = () =>
          resolve((req.result as SaleCodeMapping | undefined)?.realCode ?? localCode);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return localCode;
    }
  }
}

