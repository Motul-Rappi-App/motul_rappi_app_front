import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Commerce } from '../models/commerce.model';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {
  private localStorageKey = 'commerces';

  private commercesSubject = new BehaviorSubject<Commerce[]>(this.loadCommercesFromStorage());
  commerces$ = this.commercesSubject.asObservable();

  constructor() { }

  private loadCommercesFromStorage(): Commerce[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  getCommerces(): Observable<Commerce[]> {
    return this.commerces$;
  }

  getCommerceById(id: string): Observable<Commerce | undefined> {
    const commerces = this.commercesSubject.getValue();
    const commerce = commerces.find((c: Commerce) => c.id === id);
    return of(commerce);
  }

  addCommerce(commerce: Commerce): Observable<Commerce> {
    const currentCommerces = this.commercesSubject.getValue();
    const updatedCommerces = [...currentCommerces, commerce];

    this.commercesSubject.next(updatedCommerces);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCommerces));

    return of(commerce);
  }

  updateCommerce(id: string, updatedCommerce: Commerce): void {
    const currentCommerces = this.commercesSubject.getValue();
    const index = currentCommerces.findIndex((c: Commerce) => c.id === id);

    if (index > -1) {
      currentCommerces[index] = updatedCommerce;
      this.commercesSubject.next([...currentCommerces]);
      localStorage.setItem(this.localStorageKey, JSON.stringify(currentCommerces));
    }
  }

  deleteCommerce(id: string): void {
    const currentCommerces = this.commercesSubject.getValue();
    const updatedCommerces = currentCommerces.filter(commerce => commerce.id !== id);

    this.commercesSubject.next(updatedCommerces);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCommerces));
  }
}
