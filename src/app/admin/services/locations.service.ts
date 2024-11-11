import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LocationResponseEntitie, LocationRequestEntitie, LocationUpdateRequestEntitie } from '../../core/models';
import { JwtLocalManageService } from '../../core/services/jwt-local-manage.service';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private base_back_url: string = `${environment.BACKEND_BASE_URL}location`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtLocalManageService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const headers = this.jwtService.tokenInHeaders;
    if (!headers) {
      throw new Error('Authorization headers not found');
    }
    return headers;
  }

  getLocations(): Observable<LocationResponseEntitie[]> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<{ content: LocationResponseEntitie[] }>(this.base_back_url, { headers })
        .pipe(
          map(response => response.content)
        );
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      return throwError(() => new Error('Error al obtener ubicaciones'));
    }
  }

  getLocationById(id: string): Observable<LocationResponseEntitie> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<LocationResponseEntitie>(`${this.base_back_url}/${id}`, { headers });
    } catch (error) {
      console.error(`Error al obtener ubicación con ID ${id}:`, error);
      return throwError(() => new Error(`Error al obtener ubicación con ID ${id}`));
    }
  }

  addLocation(location: LocationRequestEntitie): Observable<LocationResponseEntitie> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.post<LocationResponseEntitie>(this.base_back_url, location, { headers });
    } catch (error) {
      console.error('Error al añadir ubicación:', error);
      return throwError(() => new Error('Error al añadir ubicación'));
    }
  }

  updateLocation(location: LocationUpdateRequestEntitie): Observable<LocationResponseEntitie> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.put<LocationResponseEntitie>(this.base_back_url, location, { headers });
    } catch (error) {
      console.error('Error al actualizar ubicación:', error);
      return throwError(() => new Error('Error al actualizar ubicación'));
    }
  }

  deleteLocation(id: string): Observable<void> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.delete<void>(`${this.base_back_url}/${id}`, { headers });
    } catch (error) {
      console.error(`Error al eliminar ubicación con ID ${id}:`, error);
      return throwError(() => new Error(`Error al eliminar ubicación con ID ${id}`));
    }
  }
}
