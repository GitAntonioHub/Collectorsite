/* src/app/auth/auth.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { AuthStore } from '../core/state/auth.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private store = inject(AuthStore);

  login(username: string, password: string) {
    return this.api.post<{ token: string }>('/auth/login', { username, password })
      .pipe(tap(res => this.store.setToken(res.token)));
  }

  register(u: string, e: string, p: string) {
    return this.api.post<{ token: string }>('/auth/register',
      { username: u, email: e, password: p })
      .pipe(tap(res => this.store.setToken(res.token)));
  }
}
