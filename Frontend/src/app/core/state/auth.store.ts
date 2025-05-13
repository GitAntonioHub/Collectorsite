/*--------------------------------------------------------------
  src/app/core/state/auth.store.ts
--------------------------------------------------------------*/
import { Injectable, signal } from '@angular/core';

/**
 * Small reactive store that holds the current JWT token.
 * Uses Angular 17 Signals so components can react automatically.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {

  /** private mutable signal */
  private readonly _token = signal<string | null>(
    localStorage.getItem('jwt')
  );

  /** read‑only signal exposed to the app */
  readonly token = this._token.asReadonly();

  /** set & persist token */
  setToken(jwt: string): void {
    this._token.set(jwt);
    localStorage.setItem('jwt', jwt);
  }

  /** clear token and log the user out */
  clear(): void {
    this._token.set(null);
    localStorage.removeItem('jwt');
  }
}
