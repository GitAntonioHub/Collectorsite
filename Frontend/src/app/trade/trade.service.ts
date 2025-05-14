/* src/app/trade/trade.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class TradeService {
  private api = inject(ApiService);

  propose(payload: any)       { return this.api.post('/trade/propose', payload); }
  accept(offerId: string)     { return this.api.put(`/trade/${offerId}/ACCEPTED`); }
  decline(offerId: string)    { return this.api.put(`/trade/${offerId}/DECLINED`); }
}
