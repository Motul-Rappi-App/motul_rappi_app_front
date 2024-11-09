import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Viscosity } from '../models/viscosity.model';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { JwtLocalManageService } from '../../core/services/jwt-local-manage.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViscositiesService {

  private base_back_url = environment.BACKEND_BASE_URL;

  private viscositiesSubject = new BehaviorSubject<any[]>([]);
  viscosities$ = this.viscositiesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtServ: JwtLocalManageService
  ) { }

  getViscosities(): Observable<any[]> {
    const headers = this.jwtServ.tokenInHeaders;
    if (!headers) { return of([]) }

    return this.http.get<Viscosity[]>(`${this.base_back_url}viscosity`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener las viscosidades:', error);
        return of([]);
      })
    );
  }

  loadViscositiesFromDb(): void {
    this.getViscosities().subscribe((viscosities) => {
      console.log('Viscosities from DB:', viscosities);
      this.viscositiesSubject.next(viscosities); 
    });
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
    // Lógica para agregar viscosidad directamente desde la DB
    const currentViscosities = this.viscositiesSubject.getValue();
    const updatedViscosities = [...currentViscosities, newViscosity];

    // Actualizamos el Subject con el nuevo valor
    this.viscositiesSubject.next(updatedViscosities);

    // Retornar observable con el nuevo elemento
    return of(newViscosity);
  }
}
