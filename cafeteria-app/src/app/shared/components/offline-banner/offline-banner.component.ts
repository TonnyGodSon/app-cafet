import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { SyncService, SyncStatus } from '../../../core/services/sync.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="visible"
      class="offline-banner"
      [class.offline]="!isOnline"
      [class.syncing]="isOnline && status === 'syncing'"
      [class.success]="isOnline && status === 'success'"
      [class.error]="isOnline && status === 'error'"
      role="status"
      aria-live="polite"
    >
      <!-- Hors connexion -->
      <ng-container *ngIf="!isOnline">
        <span class="dot"></span>
        <span class="label">
          Hors connexion
          <span *ngIf="pendingCount > 0" class="badge">{{ pendingCount }} en attente</span>
        </span>
      </ng-container>

      <!-- Synchronisation en cours -->
      <ng-container *ngIf="isOnline && status === 'syncing'">
        <span class="spinner"></span>
        <span class="label">Synchronisation… ({{ pendingCount }} restant{{ pendingCount > 1 ? 's' : '' }})</span>
      </ng-container>

      <!-- Synchronisation réussie -->
      <ng-container *ngIf="isOnline && status === 'success'">
        <span class="checkmark">✓</span>
        <span class="label">Données synchronisées</span>
      </ng-container>

      <!-- Erreur de synchronisation -->
      <ng-container *ngIf="isOnline && status === 'error'">
        <span class="dot error-dot"></span>
        <span class="label">Échec de synchronisation — nouvelle tentative au prochain démarrage</span>
      </ng-container>
    </div>
  `,
  styles: [`
    .offline-banner {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1.1rem;
      border-radius: 999px;
      font-size: 0.83rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      animation: slideUp 220ms ease-out;
      white-space: nowrap;
    }

    .offline-banner.offline {
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
    }

    .offline-banner.syncing {
      background: #1d4ed8;
      color: #eff6ff;
      border: 1px solid #3b82f6;
    }

    .offline-banner.success {
      background: #15803d;
      color: #f0fdf4;
      border: 1px solid #22c55e;
    }

    .offline-banner.error {
      background: #b91c1c;
      color: #fef2f2;
      border: 1px solid #ef4444;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      flex-shrink: 0;
    }

    .dot.error-dot {
      background: #fca5a5;
    }

    .checkmark {
      font-size: 1rem;
      font-weight: 700;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      flex-shrink: 0;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.2);
      border-radius: 999px;
      padding: 0 0.5rem;
      font-size: 0.75rem;
      margin-left: 0.25rem;
    }

    .label {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(12px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class OfflineBannerComponent implements OnInit, OnDestroy {
  private readonly connectivity = inject(ConnectivityService);
  private readonly sync = inject(SyncService);
  private readonly destroy$ = new Subject<void>();

  isOnline = true;
  status: SyncStatus = 'idle';
  pendingCount = 0;
  visible = false;

  ngOnInit(): void {
    combineLatest([
      this.connectivity.isOnline$,
      this.sync.status$,
      this.sync.pendingCount$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([online, status, count]) => {
        this.isOnline = online;
        this.status = status;
        this.pendingCount = count;

        // Affiche le bandeau si : hors-ligne, syncing, success ou erreur
        this.visible =
          !online ||
          status === 'syncing' ||
          status === 'success' ||
          status === 'error';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

