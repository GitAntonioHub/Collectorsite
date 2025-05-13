import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { ItemImage, ItemDocument } from './models';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private api = inject(ApiService);

  uploadImage(itemId: string, file: File): Observable<ItemImage> {
    const form = new FormData();
    form.append('file', file);
    return this.api.post<ItemImage>(`/upload/item-image/${itemId}`, form);
  }

  uploadDoc(itemId: string, file: File): Observable<ItemDocument> {
    const form = new FormData();
    form.append('file', file);
    return this.api.post<ItemDocument>(`/upload/item-doc/${itemId}`, form);
  }
}
