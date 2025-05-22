import { Routes } from '@angular/router';
import { MyItemsComponent } from './my-items.component';
import { BrowseComponent } from './browse.component';
import { ItemPublicDetailComponent } from './item-public-detail.component';

export const ITEMS_ROUTES: Routes = [
  {
    path: 'browse',
    component: BrowseComponent,
    title: 'Browse Items'
  },
  {
    path: ':id',
    component: ItemPublicDetailComponent,
    title: 'Item Details'
  },
  { 
    path: '', 
    component: MyItemsComponent,
    title: 'My Items'
  }
];
