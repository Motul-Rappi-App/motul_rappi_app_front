import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { AuthenticationRequestEntitie, AuthenticationResponseEntitie, CommerceRequestEntitie, CommerceResponseEntitie } from '../models';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base_back_url = environment.BACKEND_BASE_URL;

  constructor(
    private http: HttpClient,
    private jwtServ: JwtLocalManageService
  ) { }

  registerCommerce(commerce: CommerceRequestEntitie): Observable<CommerceResponseEntitie> | null {
    try {
      return this.http.post<CommerceResponseEntitie>(`${this.base_back_url}commerce`, commerce);
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  login(credentials: AuthenticationRequestEntitie): Observable<AuthenticationResponseEntitie> | null {
    try {
      return this.http.post<AuthenticationResponseEntitie>(`${this.base_back_url}auth/login`, credentials);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  checkToken(): Observable<any> | null {
    const headers = this.jwtServ.tokenInHeaders;
    if (!headers) return of(null);

    return this.http.get<any>(`${this.base_back_url}auth/checkToken`, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.log('Error al verificar el token:', error);
        return of(null);
      })
    );  
  }
}