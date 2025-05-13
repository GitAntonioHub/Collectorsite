import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _token = signal<string | null>(localStorage.getItem('jwt'));
  token = this._token.asReadonly();

  setToken(t: string) {
    this._token.set(t);
    localStorage.setItem('jwt', t);
  }
  clear() {
    this._token.set(null);
    localStorage.removeItem('jwt');
  }
}
