import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { ITEMS_ROUTES } from './items/items.routes';
import { ListingsComponent } from './listings/listings.component';

export const routes: Routes = [
  { 
    path: '',
    loadChildren: () => import('./landing/landing.routes').then(m => m.routes)
  },
  { 
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'listings',
    children: [
      { path: 'feed', component: ListingsComponent },
      { path: ':id', loadComponent: () => import('./listings/listing-detail.component').then(m => m.ListingDetailComponent) },
      { path: '', component: ListingsComponent }
    ]
  },
  {
    path: 'items',
    children: ITEMS_ROUTES
  },
  { 
    path: 'trade',
    loadChildren: () => import('./trade/trade.routes').then(m => m.TRADE_ROUTES),
    canActivate: [authGuard],
    title: 'Trade Items'
  },
  { 
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  { 
    path: '404',
    loadComponent: () => import('./shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  { 
    path: '**', 
    redirectTo: '404'
  }
];
