/*--------------------------------------------------------------
  src/app/core/state/auth.store.ts
--------------------------------------------------------------*/
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
}

/**
 * Small reactive store that holds the current JWT token.
 * Uses BehaviorSubject for reactivity and handles SSR safely.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokenKey = 'auth_token';
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Only load from localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.tokenSubject.next(localStorage.getItem(this.tokenKey));
    }
  }

  private loadToken(): string | null {
    return isPlatformBrowser(this.platformId) 
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /** set & persist token */
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.tokenSubject.next(token);
  }

  /** clear token and log the user out */
  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.roles.includes(role);
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }
}
