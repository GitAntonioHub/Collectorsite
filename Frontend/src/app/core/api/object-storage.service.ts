import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../enviroments/enviroment';

@Injectable({providedIn: 'root'})
export class ObjectStorageService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api}/upload`;

  /**
   * Raw stream upload – returns the standard HttpEvent stream so you can
   * listen for progress.
   */
  uploadRaw(file: File): Observable<HttpEvent<unknown>> {
    const form = new FormData();
    form.append('file', file, file.name);

    const req = new HttpRequest('POST', this.base, form, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  /** Convenience wrappers that match the Spring controller  */
  uploadItemImage(itemId: string, file: File) {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post(`${this.base}/item-image/${itemId}`, form);
  }

  uploadItemDoc(itemId: string, file: File) {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post(`${this.base}/item-doc/${itemId}`, form);
  }
}
