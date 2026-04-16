import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="home-shell">
      <div class="bg-orb orb-a"></div>
      <div class="bg-orb orb-b"></div>

      <section class="hero-card">
        <div class="logo-wrap">
          <img src="assets/brand/logo-food.svg" alt="Logo CaFaith Normandie" />
        </div>

        <p class="kicker">Cafeteria Management Platform</p>
        <h1>CaFaith Normandie</h1>
        <p class="subtitle">
          Gérez vos ventes du jour, vos commandes et vos rapports en quelques clics.
        </p>

        <div class="hero-actions">
          <button mat-flat-button color="primary" routerLink="/login">
            <mat-icon>login</mat-icon>
            Commencer
          </button>
          <button mat-stroked-button routerLink="/create-sale">
            <mat-icon>add_business</mat-icon>
            Nouvelle Vente
          </button>
        </div>

        <div class="feature-row">
          <div class="feature-item">
            <mat-icon>point_of_sale</mat-icon>
            <span>Encaissement rapide</span>
          </div>
          <div class="feature-item">
            <mat-icon>description</mat-icon>
            <span>Rapports détaillés</span>
          </div>
          <div class="feature-item">
            <mat-icon>insights</mat-icon>
            <span>Statistiques journalières</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-shell {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #fff6e9, #ecf5ff 48%, #f4edff);
    }

    .bg-orb {
      position: absolute;
      border-radius: 999px;
      filter: blur(8px);
      opacity: 0.55;
      animation: floatY 8s ease-in-out infinite;
    }

    .orb-a {
      width: 280px;
      height: 280px;
      background: radial-gradient(circle, #ffbf7e, #ff8f5c);
      left: -70px;
      top: -60px;
    }

    .orb-b {
      width: 260px;
      height: 260px;
      background: radial-gradient(circle, #89b6ff, #7179f8);
      right: -60px;
      bottom: -60px;
      animation-delay: 1.3s;
    }

    .hero-card {
      position: relative;
      z-index: 2;
      max-width: 760px;
      width: 100%;
      border-radius: 28px;
      background: #ffffffe6;
      border: 1px solid #f0d8ba;
      box-shadow: 0 22px 50px rgba(43, 53, 84, 0.18);
      padding: 2.2rem;
      text-align: center;
      animation: riseIn 600ms ease-out;
    }

    .logo-wrap img {
      width: 86px;
      height: 86px;
      border-radius: 22px;
      box-shadow: 0 15px 26px rgba(221, 108, 32, 0.28);
      margin-bottom: 0.9rem;
      animation: pulseGlow 2.4s ease-in-out infinite;
    }

    .kicker {
      font-size: 0.8rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #8f7b63;
      margin: 0;
    }

    h1 {
      margin: 0.4rem 0;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.1;
      color: #2f3755;
    }

    .subtitle {
      color: #556083;
      margin: 0 auto;
      max-width: 560px;
      font-size: 1rem;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 0.8rem;
      margin: 1.4rem 0 1rem;
      flex-wrap: wrap;
    }

    .hero-actions button {
      min-width: 180px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .hero-actions button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(43, 53, 84, 0.14);
    }

    .feature-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.8rem;
      margin-top: 1.2rem;
    }

    .feature-item {
      background: #ffffff;
      border: 1px solid #e9edf9;
      border-radius: 14px;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      color: #3d4870;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .feature-item:hover {
      transform: translateY(-2px);
      border-color: #f3c375;
    }

    .feature-item mat-icon {
      color: #dd6c20;
    }

    @keyframes riseIn {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes floatY {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 15px 26px rgba(221, 108, 32, 0.28); }
      50% { box-shadow: 0 20px 34px rgba(221, 108, 32, 0.4); }
    }

    @media (max-width: 720px) {
      .hero-card {
        padding: 1.4rem;
        border-radius: 20px;
      }

      .feature-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {}
