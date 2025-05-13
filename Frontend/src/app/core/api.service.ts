import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.api;

  get<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(this.base + url, { params: new HttpParams({ fromObject: params }) });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.base + url, body);
  }

  put<T>(url: string, body?: unknown): Observable<T> {
    return this.http.put<T>(this.base + url, body);
  }
}
