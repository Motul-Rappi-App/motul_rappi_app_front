import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LocationResponseEntitie, LocationRequestEntitie, LocationUpdateRequestEntitie } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private base_back_url: string = `${environment.BACKEND_BASE_URL}location`;

  constructor(
    private http: HttpClient
  ) { }

  getLocations(): Observable<LocationResponseEntitie[]> {
    return this.http.get<LocationResponseEntitie[]>(this.base_back_url);
  }

  getLocationById(id: string): Observable<LocationResponseEntitie> {
    return this.http.get<LocationResponseEntitie>(`${this.base_back_url}/${id}`);
  }

  addLocation(location: LocationRequestEntitie): Observable<LocationResponseEntitie> {
    return this.http.post<LocationResponseEntitie>(this.base_back_url, location);
  }

  updateLocation(location: LocationUpdateRequestEntitie): Observable<LocationResponseEntitie> {
    return this.http.put<LocationResponseEntitie>(this.base_back_url, location);
  }

  deleteLocation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base_back_url}/${id}`);
  }
}
