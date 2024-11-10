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
    const headers = this.getAuthHeaders();
    return this.http.get<{ content: LocationResponseEntitie[] }>(this.base_back_url, { headers })
      .pipe(
        map(response => response.content)
      );
  }

  getLocationById(id: string): Observable<LocationResponseEntitie> {
    const headers = this.getAuthHeaders();
    return this.http.get<LocationResponseEntitie>(`${this.base_back_url}/${id}`, { headers });
  }

  addLocation(location: LocationRequestEntitie): Observable<LocationResponseEntitie> {
    const headers = this.getAuthHeaders();
    return this.http.post<LocationResponseEntitie>(this.base_back_url, location, { headers });
  }  

  updateLocation(location: LocationUpdateRequestEntitie): Observable<LocationResponseEntitie> {
    const headers = this.getAuthHeaders();
    return this.http.put<LocationResponseEntitie>(this.base_back_url, location, { headers });
  }

  deleteLocation(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.base_back_url}/${id}`, { headers });
  }
}
