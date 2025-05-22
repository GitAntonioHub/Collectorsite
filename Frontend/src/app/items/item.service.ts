/* src/app/items/item.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { ItemDTO } from './models';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);

  // Get all items
  list(): Observable<ItemDTO[]> {
    return this.api.get<ItemDTO[]>('/items');
  }

  // Get user's items
  getMyItems(): Observable<ItemDTO[]> {
    return this.api.get<ItemDTO[]>('/my-items');
  }

  // Get single item
  get(id: string): Observable<ItemDTO> {
    return this.api.get<ItemDTO>(`/my-items/${id}`);
  }

  // Create new item
  create(dto: Partial<ItemDTO>): Observable<ItemDTO> {
    return this.api.post<ItemDTO>('/my-items', dto);
  }

  // Update item
  update(id: string, dto: Partial<ItemDTO>): Observable<ItemDTO> {
    return this.api.put<ItemDTO>(`/my-items/${id}`, dto);
  }

  // Delete item
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/my-items/${id}`);
  }

  // Verify item (admin only)
  verifyItem(id: string): Observable<ItemDTO> {
    return this.api.put<ItemDTO>(`/items/${id}/verify`, {});
  }
}
