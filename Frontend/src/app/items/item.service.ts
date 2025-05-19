/* src/app/items/item.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, catchError, throwError } from 'rxjs';
import { ItemDTO, Item } from './models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      // Server returned an error message
      errorMessage = error.error.message;
    } else if (typeof error.error === 'object') {
      // Handle validation errors
      const validationErrors = Object.values(error.error).join(', ');
      errorMessage = `Validation failed: ${validationErrors}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  myItems(): Observable<ItemDTO[]> {
    return this.api.get<ItemDTO[]>('/items')
      .pipe(catchError(this.handleError));
  }

  create(body: Partial<ItemDTO>): Observable<ItemDTO> {
    return this.api.post<ItemDTO>('/items', body)
      .pipe(catchError(this.handleError));
  }

  one(id: string): Observable<ItemDTO> {
    return this.api.get<ItemDTO>(`/items/${id}`)
      .pipe(catchError(this.handleError));
  }

  makeListable(itemId: string): Observable<ItemDTO> {
    return this.api.post<ItemDTO>(`/items/${itemId}/make-listable`, {})
      .pipe(catchError(this.handleError));
  }

  getItems(search: string = '', page: number = 0, size: number = 12): Observable<any> {
    const params = {
      q: search,
      page: page.toString(),
      size: size.toString(),
      status: 'ACTIVE'
    };
    return this.api.get<any>('/listings', params)
      .pipe(catchError(this.handleError));
  }
}
