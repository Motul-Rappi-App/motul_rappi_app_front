import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { AuthenticationRequestEntity, AuthenticationResponseEntity, CommerceRequestEntity, CommerceResponseEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtServ: JwtLocalManageService
  ) { }

  registerCommerce(commerce: CommerceRequestEntity): Observable<CommerceResponseEntity> | null {
    try {
      return this.http.post<CommerceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}commerce`, commerce, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  login(credentials: AuthenticationRequestEntity): Observable<AuthenticationResponseEntity> | null {
    try {
      return this.http.post<AuthenticationResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}auth/login`, credentials);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //TODO refactorizar este metodo cuanto el jwt este bien implmentado en AuthenticationEntity
  checkToken(): Observable<any> | null {
    const headers = this.jwtServ.tokenInHeaders;
    if (!headers) return of(null);

    return this.http.get<any>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}auth/checkToken`, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.log('Error al verificar el token:', error);
        return of(null);
      })
    );  
  }
}