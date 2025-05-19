/* src/app/core/api.service.ts */
import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

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
    
    return throwError(() => errorMessage);
  }

  private createUrl(path: string): string {
    return `${this.base}${path}`;
  }

  get<T>(path: string, params: any = {}): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(this.createUrl(path), { params: httpParams }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.createUrl(path), body).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.createUrl(path), body).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.createUrl(path)).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}
