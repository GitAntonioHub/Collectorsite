import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../core/state/auth.store';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'shared-header',
  imports: [CommonModule, RouterLink],
  template: `
    <header>
      <nav class="flex items-center gap-3">
        <a routerLink="/" class="retro-btn site-title">Collector‑Site</a>
        <a routerLink="/listings" class="retro-btn nav-link">Browse</a>
        <a [routerLink]="auth.isAuthenticated() ? '/my-items' : '/login'" class="retro-btn nav-link">My&nbsp;Items</a>
        <a [routerLink]="auth.isAuthenticated() ? '/offers' : '/login'" class="retro-btn nav-link">Trade</a>
        <a *ngIf="auth.isAdmin()" routerLink="/verify" class="retro-btn nav-link">Admin</a>

        <!-- Account Section -->
        <ng-container *ngIf="auth.isAuthenticated(); else loginButton">
          <button 
            class="retro-btn nav-link relative"
            (click)="toggleMenu()"
            [class.active]="isMenuOpen">
            My Account
          </button>

          <!-- Dropdown Menu -->
          <div *ngIf="isMenuOpen" 
              class="absolute mt-2 w-48 bg-black border-2 border-white z-50"
              style="margin-left: -6rem; margin-top: 2.5rem;">
            <a routerLink="/profile" 
               class="menu-item border-b-2 border-white" 
               (click)="isMenuOpen = false">
              Profile
            </a>
            <a routerLink="/settings" 
               class="menu-item border-b-2 border-white" 
               (click)="isMenuOpen = false">
              Settings
            </a>
            <button (click)="logout()" 
                    class="menu-item w-full text-left">
              Logout
            </button>
          </div>
        </ng-container>
        <ng-template #loginButton>
          <a routerLink="/login" class="retro-btn nav-link">Login</a>
        </ng-template>
      </nav>
    </header>

    <style>
      nav {
        padding: 1rem;
        display: flex;
        flex-direction: row;
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
      .menu-item {
        @apply block w-full px-4 py-2 text-white hover:bg-white/10 transition-colors cursor-pointer text-base uppercase tracking-wider text-center;
        font-family: 'RetroFuture', sans-serif;
        min-height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .retro-btn.active {
        @apply bg-white/20;
      }
      .menu-item:hover {
        color: white;
      }
    </style>
  `
})
export class SharedHeaderComponent implements OnInit {
  protected auth = inject(AuthStore);
  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected isMenuOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('click', (e: MouseEvent) => {
        if (this.isMenuOpen && !(e.target as Element).closest('.retro-btn')) {
          this.isMenuOpen = false;
        }
      });
    }
  }

  protected toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected logout() {
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }
}
