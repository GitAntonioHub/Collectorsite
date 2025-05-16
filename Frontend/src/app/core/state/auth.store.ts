/*--------------------------------------------------------------
  src/app/core/state/auth.store.ts
--------------------------------------------------------------*/
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

/**
 * Small reactive store that holds the current JWT token.
 * Uses BehaviorSubject for reactivity and handles SSR safely.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly tokenKey = 'token';
  private readonly initialState: AuthState = {
    token: null,
    user: null
  };

  private state = new BehaviorSubject<AuthState>(this.initialState);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Only load from localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.tokenSubject.next(token);
        // You might want to decode the JWT here to get user info
        // and update the state accordingly
      }
    }
  }

  get token() {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.tokenKey)
      : this.tokenSubject.value;
  }

  get isAuthenticated() {
    return !!this.token;
  }

  setAuth(response: { token: string; user: AuthUser }) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, response.token);
    }
    this.tokenSubject.next(response.token);
    this.state.next({
      token: response.token,
      user: response.user
    });
  }

  clearAuth() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.tokenSubject.next(null);
    this.state.next(this.initialState);
  }

  hasRole(role: string): boolean {
    const token = this.token;
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles?.includes(role) || false;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }
}
