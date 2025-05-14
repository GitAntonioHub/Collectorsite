import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { AuthStore } from '../core/state/auth.store';
import { tap, Observable } from 'rxjs';

interface JwtResponse { token: string }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api   = inject(ApiService);
  private store = inject(AuthStore);

  /** POST /auth/login */
  login(username: string, password: string): Observable<JwtResponse> {
    return this.api.post<JwtResponse>('/auth/login', { username, password })
      .pipe(tap(res => this.store.setToken(res.token)));
  }

  /** POST /auth/register */
  register(username: string, email: string, password: string): Observable<JwtResponse> {
    return this.api.post<JwtResponse>('/auth/register',
      { username, email, password })
      .pipe(tap(res => this.store.setToken(res.token)));
  }

  logout() { this.store.clear(); }
}
