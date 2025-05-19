/* src/app/items/item.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, catchError, throwError } from 'rxjs';
import { ItemDTO, Item } from './models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  myItems(): Observable<ItemDTO[]> {
    return this.api.get<ItemDTO[]>('/api/items')
      .pipe(catchError(this.handleError));
  }

  create(item: any): Observable<ItemDTO> {
    return this.api.post<ItemDTO>('/api/items', item)
      .pipe(catchError(this.handleError));
  }

  update(id: string, item: any): Observable<ItemDTO> {
    return this.api.put<ItemDTO>(`/api/items/${id}`, item)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/api/items/${id}`)
      .pipe(catchError(this.handleError));
  }

  get(id: string): Observable<ItemDTO> {
    return this.api.get<ItemDTO>(`/api/items/${id}`)
      .pipe(catchError(this.handleError));
  }

  makeListable(itemId: string): Observable<ItemDTO> {
    return this.api.post<ItemDTO>(`/api/items/${itemId}/make-listable`, {})
      .pipe(catchError(this.handleError));
  }

  getItems(search: string = '', page: number = 0, size: number = 12): Observable<any> {
    const params = {
      q: search,
      page: page.toString(),
      size: size.toString()
    };
    return this.api.get<any>('/api/listings', params)
      .pipe(catchError(this.handleError));
  }
}
