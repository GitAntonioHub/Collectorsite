/* src/app/core/api.service.ts */
import {inject, Injectable} from '@angular/core';
import {environment} from '../../enviroments/enviroment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.api;

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => errorMessage);
  }

  get = <T>(u: string, p?: any): Observable<T> => 
    this.http.get<T>(this.base + u, { params: p }).pipe(
      retry(1),
      catchError(this.handleError)
    );

  post = <T>(u: string, b: any): Observable<T> => 
    this.http.post<T>(this.base + u, b).pipe(
      retry(1),
      catchError(this.handleError)
    );

  put = <T>(u: string, b?: any): Observable<T> => 
    this.http.put<T>(this.base + u, b).pipe(
      retry(1),
      catchError(this.handleError)
    );

  del = <T>(u: string): Observable<T> => 
    this.http.delete<T>(this.base + u).pipe(
      retry(1),
      catchError(this.handleError)
    );
}
