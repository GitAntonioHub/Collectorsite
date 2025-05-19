/* src/app/listings/listing.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { ListingDTO } from './models';
import { Page } from '../shared/page.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private api = inject(ApiService);

  feed(search: string = '', page: number = 0, size: number = 12, sort: string = 'newest'): Observable<Page<ListingDTO>> {
    const params = {
      q: search,
      page: page.toString(),
      size: size.toString(),
      sort: this.getSortParam(sort)
    };

    return this.api.get<Page<ListingDTO>>('/api/listings', params);
  }

  private getSortParam(sort: string): string {
    switch (sort) {
      case 'price_asc':
        return 'price,asc';
      case 'price_desc':
        return 'price,desc';
      case 'newest':
      default:
        return 'createdAt,desc';
    }
  }

  update(id: string, body: Partial<ListingDTO>): Observable<ListingDTO> {
    return this.api.put<ListingDTO>(`/api/listings/${id}`, body);
  }

  get(id: string): Observable<ListingDTO> {
    return this.api.get<ListingDTO>(`/api/listings/${id}`);
  }

  create(dto: Partial<ListingDTO>): Observable<ListingDTO> { 
    return this.api.post<ListingDTO>('/api/listings', dto); 
  }

  close(id: string): Observable<ListingDTO> { 
    return this.api.put<ListingDTO>(`/api/listings/${id}/close`, {}); 
  }
}
