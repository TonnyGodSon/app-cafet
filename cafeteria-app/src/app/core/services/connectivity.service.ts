import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _isOnline$ = new BehaviorSubject<boolean>(
    isPlatformBrowser(this.platformId) ? navigator.onLine : true
  );

  /** Observable du statut réseau (true = en ligne, false = hors connexion) */
  readonly isOnline$ = this._isOnline$.asObservable().pipe(distinctUntilChanged());

  get isOnline(): boolean {
    return this._isOnline$.value;
  }

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('online', () => {
      console.log('[Connectivity] Connexion rétablie');
      this._isOnline$.next(true);
    });

    window.addEventListener('offline', () => {
      console.log('[Connectivity] Hors connexion');
      this._isOnline$.next(false);
    });
  }
}

