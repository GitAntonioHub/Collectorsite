/* src/app/listings/listing.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { ListingDTO } from './models';
import { Page } from '../shared/page.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private api = inject(ApiService);

  feed(search: string = '', page: number = 0, size: number = 12): Observable<any> {
    const params = { search, page: page.toString(), size: size.toString() };
    return this.api.get<any>('/api/listings', params);
  }

  update(id: string, body: Partial<ListingDTO>): Observable<ListingDTO> {
    return this.api.put<ListingDTO>(`/api/listings/${id}`, body);
  }

  get(id: string, params: any = {}): Observable<ListingDTO> {
    return this.api.get<ListingDTO>(`/api/listings/${id}`, params);
  }

  create(dto: any): Observable<ListingDTO> { 
    return this.api.post<ListingDTO>('/api/listings', dto); 
  }

  close(id: string): Observable<ListingDTO> { 
    return this.api.put<ListingDTO>(`/api/listings/${id}/close`, {}); 
  }
}
