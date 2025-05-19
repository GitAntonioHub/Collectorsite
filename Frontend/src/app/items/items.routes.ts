import { Routes } from '@angular/router';
import { MyItemsComponent } from './my-items.component';
import { BrowseComponent } from './browse.component';

export const ITEMS_ROUTES: Routes = [
  {
    path: 'browse',
    component: BrowseComponent,
    title: 'Browse Items'
  },
  { path: '', component: MyItemsComponent }
];
