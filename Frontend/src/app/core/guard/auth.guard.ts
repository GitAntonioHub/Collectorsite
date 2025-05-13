import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../state/auth.store';           // << correct path

/** Redirects to /login if no JWT token is present. */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const token = inject(AuthStore).token();
  return token ? true : inject(Router).createUrlTree(['/login']);
};
