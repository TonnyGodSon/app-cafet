import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-shell">
      <div class="nav-loader" *ngIf="isNavigating">
        <img src="assets/brand/logo-food.svg" alt="Chargement" />
        <span>CaFaith Normandie</span>
      </div>

      <div class="route-stage" [class.route-animate]="routeAnimate">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      position: relative;
    }

    .nav-loader {
      position: fixed;
      top: 14px;
      right: 14px;
      z-index: 1200;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #ffffffde;
      border: 1px solid #f0ddc0;
      border-radius: 999px;
      padding: 0.35rem 0.8rem;
      box-shadow: 0 10px 22px rgba(33, 45, 78, 0.16);
      animation: loaderIn 220ms ease-out;
    }

    .nav-loader img {
      width: 24px;
      height: 24px;
      border-radius: 8px;
      animation: spinPulse 1.2s linear infinite;
    }

    .nav-loader span {
      font-size: 0.82rem;
      font-weight: 700;
      color: #2d3550;
      letter-spacing: 0.02em;
    }

    .route-stage {
      opacity: 1;
      transform: translateY(0);
    }

    .route-stage.route-animate {
      animation: routeIn 360ms ease-out;
    }

    @keyframes routeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes loaderIn {
      from {
        opacity: 0;
        transform: scale(0.92) translateY(-4px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes spinPulse {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.05); }
      100% { transform: rotate(360deg) scale(1); }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  isNavigating = false;
  routeAnimate = true;

  ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isNavigating = true;
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.routeAnimate = false;
          setTimeout(() => {
            this.routeAnimate = true;
            this.isNavigating = false;
          }, 40);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
