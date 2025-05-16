import { Routes } from '@angular/router';
import { TradeViewComponent } from './trade-view.component';

export const TRADE_ROUTES: Routes = [
  {
    path: '',
    component: TradeViewComponent,
    title: 'Available Items for Trade'
  }
];
