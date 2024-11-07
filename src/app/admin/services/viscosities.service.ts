import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Viscosity } from '../models/viscosity.model';

@Injectable({
  providedIn: 'root'
})
export class ViscositiesService {

  private localStorageKey = 'viscosities';

  private viscositiesSubject = new BehaviorSubject<Viscosity[]>(this.loadViscositiesFromStorage());
  viscosities$ = this.viscositiesSubject.asObservable();

  constructor() { }

  private loadViscositiesFromStorage(): Viscosity[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  getViscosities(): Observable<Viscosity[]> {
    return this.viscosities$;
  }

  getViscosityById(id: string): Observable<Viscosity | undefined> {
    const viscosities = this.viscositiesSubject.getValue();
    const viscosity = viscosities.find((v: Viscosity) => v.id === id);
    return new Observable((observer) => {
      observer.next(viscosity);
      observer.complete();
    });
  }

  addViscosity(newViscosity: Viscosity): Observable<Viscosity> {
    const currentViscosities = this.viscositiesSubject.getValue();
    const updatedViscosities = [...currentViscosities, newViscosity];

    this.viscositiesSubject.next(updatedViscosities);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedViscosities));

    return of(newViscosity);
  }
}