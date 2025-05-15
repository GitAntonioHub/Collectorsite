import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

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
    path: 'items',
    loadChildren: () => import('./items/items.routes').then(m => m.routes)
  },
  { 
    path: 'trade',
    loadChildren: () => import('./trade/trade.routes').then(m => m.routes)
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
    loadComponent: () => import('./profile/settings.component').then(m => m.SettingsComponent),
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
