/* src/app/core/api.service.ts */
import {inject, Injectable} from '@angular/core';
import {environment} from '../../enviroments/enviroment';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.api;

  get  = <T>(u: string, p?: any) => this.http.get<T>(this.base + u, { params: p });
  post = <T>(u: string, b: any)  => this.http.post<T>(this.base + u, b);
  put  = <T>(u: string, b?: any) => this.http.put<T>(this.base + u, b);
  del  = <T>(u: string)          => this.http.delete<T>(this.base + u);
}
