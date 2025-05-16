import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../core/state/auth.store';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'shared-header',
  imports: [
    CommonModule, 
    RouterLink,
    MatIconModule
  ],
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition(':enter', [
        animate('150ms ease-out')
      ]),
      transition(':leave', [
        animate('100ms ease-in')
      ])
    ])
  ],
  template: `
    <header>
      <nav class="nav-container">
        <div class="nav-left">
          <a routerLink="/" class="retro-btn site-title">Collector‑Site</a>
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>

        <div class="nav-links" [class.mobile-open]="isMobileMenuOpen">
          <a routerLink="/listings" class="retro-btn nav-link">Browse</a>
          <a [routerLink]="auth.isAuthenticated ? '/items' : '/login'" class="retro-btn nav-link">My&nbsp;Items</a>
          <a [routerLink]="auth.isAuthenticated ? '/trade' : '/login'" class="retro-btn nav-link">Trade</a>
          <a *ngIf="auth.hasRole('ADMIN')" routerLink="/verify" class="retro-btn nav-link">Admin</a>

          <!-- Account Section -->
          <ng-container *ngIf="auth.isAuthenticated; else loginButton">
            <div class="account-container">
              <button 
                class="retro-btn nav-link"
                (click)="toggleMenu($event)"
                [class.active]="isMenuOpen">
                My Account
              </button>

              <!-- Dropdown Menu -->
              <div *ngIf="isMenuOpen" 
                  [@dropdownAnimation]
                  class="dropdown-menu">
                <a routerLink="/profile" 
                   class="menu-item" 
                   (click)="closeMenus()">
                  Profile
                </a>
                <div class="menu-divider"></div>
                <a routerLink="/settings" 
                   class="menu-item" 
                   (click)="closeMenus()">
                  Settings
                </a>
                <div class="menu-divider"></div>
                <a class="menu-item"
                   (click)="logout()">
                  Logout
                </a>
              </div>
            </div>
          </ng-container>
          <ng-template #loginButton>
            <a routerLink="/login" class="retro-btn nav-link">Login</a>
          </ng-template>
        </div>
      </nav>
    </header>

    <style>
      .nav-container {
        padding: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .nav-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .retro-btn {
        font-family: 'RetroFuture', sans-serif !important;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        height: 2.5rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 1rem !important;
        min-width: max-content !important;
        white-space: nowrap !important;
      }

      .site-title {
        min-width: 10rem !important;
        font-weight: 700 !important;
      }

      .nav-link {
        width: 7rem !important;
      }

      .account-container {
        position: relative;
        display: inline-block;
        width: 7rem;
      }

      .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        width: 7rem;
        background-color: black;
        border: 2px solid white;
        z-index: 50;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        transform-origin: top right;
      }

      .menu-item {
        @apply block w-full text-white hover:bg-white/10 transition-colors cursor-pointer text-base uppercase tracking-wider text-center;
        font-family: 'RetroFuture', sans-serif;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem !important;
        white-space: nowrap;
        text-decoration: none;
      }

      .menu-divider {
        height: 1px;
        background-color: rgba(255, 255, 255, 0.2);
        margin: 0;
      }

      .retro-btn.active {
        @apply bg-white/20;
      }

      .menu-item:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }

      @media (max-width: 768px) {
        .nav-container {
          padding: 0.5rem;
        }

        .mobile-menu-btn {
          display: block;
        }

        .nav-links {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          background-color: black;
          padding: 1rem;
          gap: 0.5rem;
          border-bottom: 2px solid white;
        }

        .nav-links.mobile-open {
          display: flex;
        }

        .nav-link {
          width: 100% !important;
        }

        .account-container {
          width: 100%;
        }

        .dropdown-menu {
          position: static;
          width: 100%;
          margin-top: 0.5rem;
        }
      }
    </style>
  `
})
export class SharedHeaderComponent implements OnInit {
  protected auth = inject(AuthStore);
  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected isMenuOpen = false;
  protected isMobileMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  protected toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  protected closeMenus() {
    this.isMenuOpen = false;
    this.isMobileMenuOpen = false;
  }

  protected logout() {
    this.auth.clearAuth();
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  private handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-container')) {
      this.isMenuOpen = false;
    }
  }
}
