import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private LOGIN_URL = 'http://localhost:3000/login';
    private tokenKey = 'authToken';

    constructor(
        private httpCliente: HttpClient,
        private storageService: StorageService,
        private router: Router
    ){}

    public login(user: string, password: string): Observable<any>{
        return this.httpCliente.post<any>(this.LOGIN_URL, {user, password}).pipe(
            tap(response => {
                if( response.token) console.log("Token: ", response.token);
            })
        );
    }

    public isAuthenticated(): boolean {
        const token = this.storageService.getToken();
        if (!token) return false;
    
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
    
        return new Date().getTime() < exp;
    }

    public logout(): void {
        this.storageService.removeToken();
        this.router.navigateByUrl('/login');
    }

}