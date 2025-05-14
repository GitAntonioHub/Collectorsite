/* src/app/listings/listing.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { ListingDTO } from './models';
import { Page } from '../shared/page.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private api = inject(ApiService);

  feed(q = '', page = 0, size = 12) {
    return this.api.get<Page<ListingDTO>>('/listings', { q, page, size });
  }

  create(dto: any)   { return this.api.post<ListingDTO>('/listings', dto); }
  close(id: string)  { return this.api.put<ListingDTO>(`/listings/${id}/close`); }
}
