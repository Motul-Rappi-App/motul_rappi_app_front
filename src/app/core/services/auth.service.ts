import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { AuthenticationRequestEntitie, AuthenticationResponseEntitie, CommerceRequestEntitie, CommerceResponseEntitie } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private base_back_url = environment.BACKEND_BASE_URL;

    constructor(
        private http: HttpClient, 
        private jwtServ: JwtLocalManageService
    ) { }


    registerCommerce(commerce: CommerceRequestEntitie): Observable<CommerceResponseEntitie> | null{
        try {  
            return this.http.post<CommerceResponseEntitie>(`${this.base_back_url}commerce`, commerce);
        } catch (error) {
        
            console.error(error);
            return null;
        }
    }

    login(credentials: AuthenticationRequestEntitie): Observable<AuthenticationResponseEntitie> | null{
        try {
            return this.http.post<AuthenticationResponseEntitie>(`${this.base_back_url}auth/login`, credentials);
        } catch (error) {
        
            console.error(error);
            return null;
        }
    }

    checkToken(): Observable<any> | null{
        try {
            const headers = this.jwtServ.tokenInHeaders;
            if(!headers) throw new Error('No token found');
            
            return this.http.get<any>(`${this.base_back_url}auth/checkToken`, {headers});
        } catch (error) {
        
            console.error(error);
            return null;
        }
    }
}