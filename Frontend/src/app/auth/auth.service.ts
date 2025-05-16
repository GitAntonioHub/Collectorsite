import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthStore } from '../core/state/auth.store';
import { isPlatformBrowser } from '@angular/common';

interface LoginCredentials {
  identifier: string;  // can be either username or email
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.api;

  constructor(
    private http: HttpClient,
    private authStore: AuthStore,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getStorage() {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  login(credentials: LoginCredentials) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const storage = this.getStorage();
          if (storage) {
            storage.setItem('token', response.token);
          }
          this.authStore.setAuth(response);
        })
      );
  }

  register(username: string, email: string, password: string) {
    const credentials: RegisterCredentials = { username, email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, credentials)
      .pipe(
        tap(response => {
          const storage = this.getStorage();
          if (storage) {
            storage.setItem('token', response.token);
          }
          this.authStore.setAuth(response);
        })
      );
  }

  logout() {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('token');
    }
    this.authStore.clearAuth();
  }

  isAuthenticated(): boolean {
    const storage = this.getStorage();
    return storage ? !!storage.getItem('token') : false;
  }
}
