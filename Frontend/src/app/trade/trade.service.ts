/* src/app/trade/trade.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TradeOffer } from './models';

export interface TradableItem {
  id: string;
  title: string;
  description: string;
  estimatedValue: number;
  images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private baseUrl = environment.apiUrl + '/trades';

  constructor(private http: HttpClient) {}

  getAvailableItems(): Observable<TradableItem[]> {
    return this.http.get<TradableItem[]>(`${this.baseUrl}/available-items`);
  }

  createTradeOffer(offer: Partial<TradeOffer>): Observable<TradeOffer> {
    return this.http.post<TradeOffer>(`${this.baseUrl}/offers`, offer);
  }

  getMyTradeOffers(): Observable<TradeOffer[]> {
    return this.http.get<TradeOffer[]>(`${this.baseUrl}/my-offers`);
  }
}
