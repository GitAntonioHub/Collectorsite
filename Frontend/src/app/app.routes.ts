import { Routes } from '@angular/router';

export const routes: Routes = [
  { path:'',          loadChildren:()=>import('./landing/landing.routes').then(m=>m.routes) },
  { path:'login',     loadChildren:()=>import('./auth/auth.routes').then(m=>m.routes) },
  { path:'register',  loadChildren:()=>import('./auth/auth.routes').then(m=>m.routes) },

];
