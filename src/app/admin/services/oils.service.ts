import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Oil } from '../models/oil.model';

@Injectable({
  providedIn: 'root'
})
export class OilsService {

  private localStorageKey = 'oils';

  private oilsSubject = new BehaviorSubject<Oil[]>(this.loadOilsFromStorage());
  oils$ = this.oilsSubject.asObservable();

  constructor() { }

  private loadOilsFromStorage(): Oil[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  getOils(): Observable<Oil[]> {
    return this.oils$;
  }

  getOilById(id: string): Observable<Oil | undefined> {
    const oils = this.oilsSubject.getValue();
    const oil = oils.find((o: Oil) => o.id === id);
    return of(oil);
  }

  addOil(oil: Oil): void {
    const currentOils = this.oilsSubject.getValue();
    const updatedOils = [...currentOils, oil];

    this.oilsSubject.next(updatedOils);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedOils));
  }

  updateOil(id: string, updatedOil: Oil): void {
    const currentOils = this.oilsSubject.getValue();
    const index = currentOils.findIndex((o: Oil) => o.id === id);

    if (index > -1) {
      currentOils[index] = updatedOil;
      this.oilsSubject.next([...currentOils]);
      localStorage.setItem(this.localStorageKey, JSON.stringify(currentOils));
    }
  }

  deleteOil(id: string): void {
    const currentOils = this.oilsSubject.getValue();
    const updatedOils = currentOils.filter((o: Oil) => o.id !== id);

    this.oilsSubject.next(updatedOils);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedOils));
  }
}
