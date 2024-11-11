import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtLocalManageService } from '../../core/services/jwt-local-manage.service';
import { CommerceRequestEntitie, CommerceResponseEntitie, CommerceUpdateRequestEntitie } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {

  private base_back_url: string = `${environment.BACKEND_BASE_URL}commerce`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtLocalManageService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const headers = this.jwtService.tokenInHeaders;
    if (!headers) {
      throw new Error('Authorization headers not found');
    }
    return headers;
  }

  getCommerces(): Observable<CommerceResponseEntitie[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ content: CommerceResponseEntitie[] }>(this.base_back_url, { headers })
      .pipe(
        map(response => response.content),
        catchError(error => {
          return throwError(() => new Error('Error al obtener comercios'));
        })
      );
  }

  getCommerceById(id: string): Observable<CommerceResponseEntitie> {
    const headers = this.getAuthHeaders();
    return this.http.get<CommerceResponseEntitie>(`${this.base_back_url}/${id}`, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => new Error(`Error al obtener comercio con ID ${id}`));
        })
      );
  }

  addCommerce(commerce: CommerceRequestEntitie): Observable<CommerceResponseEntitie> {
    const headers = this.getAuthHeaders();
    return this.http.post<CommerceResponseEntitie>(this.base_back_url, commerce, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);  // Retorna el error directamente para manejarlo en el componente
        })
      );
  }

  updateCommerce(commerce: CommerceUpdateRequestEntitie): Observable<CommerceResponseEntitie> {
    const headers = this.getAuthHeaders();
    return this.http.put<CommerceResponseEntitie>(this.base_back_url, commerce, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  deleteCommerce(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.base_back_url}/${id}`, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => new Error(`Error al eliminar comercio con ID ${id}`));
        })
      );
  }
}
