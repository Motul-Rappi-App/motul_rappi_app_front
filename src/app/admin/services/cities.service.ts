import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private localStorageKey = 'cities';

  private citiesSubject = new BehaviorSubject<City[]>(this.loadCitiesFromStorage());
  cities$ = this.citiesSubject.asObservable();
  constructor() { }

  private loadCitiesFromStorage(): City[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  getCities(): Observable<City[]> {
    return this.cities$;
  }

  getCityById(id: string): Observable<City | undefined> {
    const cities = this.citiesSubject.getValue();
    const city = cities.find((c: City) => c.id === id);
    return new Observable((observer) => {
      observer.next(city);
      observer.complete();
    });
  }

  addCity(newCity: City): Observable<City> {
    const currentCities = this.citiesSubject.getValue();
    const updatedCities = [...currentCities, newCity];

    this.citiesSubject.next(updatedCities);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCities));

    return of(newCity);
  }

  updateCity(updatedCity: City): Observable<City> {
    const currentCities = this.citiesSubject.getValue();
    const updatedCities = currentCities.map((city) =>
      city.id === updatedCity.id ? updatedCity : city
    );

    this.citiesSubject.next(updatedCities);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCities));

    return of(updatedCity);
  }

  deleteCity(id: string): Observable<boolean> {
    const currentCities = this.citiesSubject.getValue();
    const updatedCities = currentCities.filter(city => city.id !== id);

    this.citiesSubject.next(updatedCities);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCities));

    return of(true);
  }
}
