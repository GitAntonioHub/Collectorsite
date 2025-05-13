import { Routes } from '@angular/router';
import { authGuard } from './app/core/guard/auth.guard';

export const routes: Routes = [
  { path: 'login', loadChildren: () => import('./app/auth/auth.routes').then(m => m.routes) },
  { path: 'listings', loadChildren: () => import('./app/listings/listings.routes').then(m => m.routes) },
  { path: 'my-items', loadChildren: () => import('./app/items/items.routes').then(m => m.routes), canActivate: [authGuard] },
  { path: 'offers', loadChildren: () => import('./app/trade/trade.routes').then(m => m.routes), canActivate: [authGuard] },
  { path: 'verify', loadChildren: () => import('./app/admin/admin.routes').then(m => m.routes), canActivate: [authGuard] },
  { path: '', redirectTo: 'listings', pathMatch: 'full' }
];
