/* src/app/listings/listing.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { ListingDTO } from './models';
import { Page } from '../shared/page.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private api = inject(ApiService);

  // Browse all active listings
  browse(search: string = '', page: number = 0, size: number = 12, sort: string = 'newest'): Observable<Page<ListingDTO>> {
    const params = {
      q: search,
      page: page.toString(),
      size: size.toString(),
      sort: this.getSortParam(sort)
    };

    return this.api.get<Page<ListingDTO>>('/listings', params);
  }

  // Get user's listings
  getMyListings(page: number = 0, size: number = 12): Observable<Page<ListingDTO>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.api.get<Page<ListingDTO>>('/listings/my-listings', params);
  }

  // Get single listing
  get(id: string): Observable<ListingDTO> {
    return this.api.get<ListingDTO>(`/listings/${id}`);
  }

  // Create new listing
  create(dto: Partial<ListingDTO>): Observable<ListingDTO> { 
    return this.api.post<ListingDTO>('/listings', dto); 
  }

  // Update listing
  update(id: string, dto: Partial<ListingDTO>): Observable<ListingDTO> {
    return this.api.put<ListingDTO>(`/listings/${id}`, dto);
  }

  // Close listing
  close(id: string): Observable<ListingDTO> { 
    return this.api.put<ListingDTO>(`/listings/${id}/close`, {}); 
  }

  // Delete listing
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/listings/${id}`);
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
}
