import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, map, filter } from 'rxjs';
import { ItemImage, ItemDocument } from './models';
import { UploadProgress } from '../core/models';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private api = inject(ApiService);

  uploadImage(itemId: string, file: File): Observable<ItemImage> {
    const form = new FormData();
    form.append('file', file);
    return this.api.post<UploadProgress<ItemImage>>(`/upload/item-image/${itemId}`, form).pipe(
      filter(progress => progress.done),
      map(progress => progress.body!)
    );
  }

  uploadDoc(itemId: string, file: File): Observable<ItemDocument> {
    const form = new FormData();
    form.append('file', file);
    return this.api.post<UploadProgress<ItemDocument>>(`/upload/item-doc/${itemId}`, form).pipe(
      filter(progress => progress.done),
      map(progress => progress.body!)
    );
  }
}
