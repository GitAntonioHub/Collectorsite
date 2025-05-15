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
        <a routerLink="/" class="retro-btn">Collector‑Site</a>
        <a routerLink="/listings" class="retro-btn">Browse</a>
        <a [routerLink]="auth.isAuthenticated() ? '/my-items' : '/login'" class="retro-btn">My&nbsp;Items</a>
        <a [routerLink]="auth.isAuthenticated() ? '/offers' : '/login'" class="retro-btn">Trade</a>
        <a *ngIf="auth.isAuthenticated()" routerLink="/verify" class="retro-btn">Admin</a>

        <!-- Account Section -->
        <ng-container *ngIf="auth.isAuthenticated(); else loginButton">
          <div class="relative">
            <button 
              class="retro-btn"
              (click)="toggleMenu()"
              [class.active]="isMenuOpen">
              My Account
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="isMenuOpen" 
                class="absolute right-0 top-full mt-2 w-48 bg-black border-2 border-white z-50">
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
          </div>
        </ng-container>
        <ng-template #loginButton>
          <a routerLink="/login" class="retro-btn">Login</a>
        </ng-template>
      </nav>
    </header>

    <style>
      nav {
        padding: 1rem;
      }
      .menu-item {
        @apply block w-full px-4 py-2 text-white hover:bg-white/10 transition-colors cursor-pointer text-base uppercase tracking-wider;
        font-family: 'RetroFuture', sans-serif;
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
        if (this.isMenuOpen && !(e.target as Element).closest('.relative')) {
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
