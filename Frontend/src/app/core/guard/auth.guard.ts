import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

/** Redirects to /login if no JWT token is present. */
export const authGuard = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (authStore.isAuthenticated) {
    return true;
  }

  return router.parseUrl('/login');
};
