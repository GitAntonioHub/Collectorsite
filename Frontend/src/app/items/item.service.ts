/* src/app/items/item.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { ItemDTO } from './models';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);

  myItems(): Observable<ItemDTO[]>  { return this.api.get<ItemDTO[]>('/items'); }
  create(body: Partial<ItemDTO>)    { return this.api.post<ItemDTO>('/items', body); }
  one(id: string)                   { return this.api.get<ItemDTO>(`/items/${id}`); }
}
