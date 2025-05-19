import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private authStore: AuthStore
  ) {}

  canActivate(): boolean {
    if (this.authStore.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
    return false;
  }
} 