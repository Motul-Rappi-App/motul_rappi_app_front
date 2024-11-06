import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null{
    return localStorage.getItem('token');
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

}
