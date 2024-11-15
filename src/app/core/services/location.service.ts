import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, switchMap, tap } from 'rxjs';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { environment } from '../../../environments/environment.development';
import { LocationRequestEntity, LocationResponseEntity, LocationUpdateRequestEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private path_back_url = "location";
  constructor(private http: HttpClient,
              private jwtServ: JwtLocalManageService
  ) { }

  getAllLocations(): Observable<LocationResponseEntity[]> | null {
    const allLocations: LocationResponseEntity[] = [];
    const pageSize = 10; 

    const fetchPage = (page: number): Observable<LocationResponseEntity[]> => {
      return this.http.get<{ content: LocationResponseEntity[], last: boolean }>(
        `${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`,
        {
          headers: this.jwtServ.tokenInHeaders || new HttpHeaders(),
          params: { page: page.toString(), size: pageSize.toString() }
        }
      ).pipe(
        tap(response => allLocations.push(...response.content)),
        switchMap(response => response.last ? of(allLocations) : fetchPage(page + 1))
      );
    };

  return fetchPage(0);
  }

  getLocationById(id: number): Observable<LocationResponseEntity> | null {
    try {
      return this.http.get<LocationResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}/${id}`, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  createLocation(location: LocationRequestEntity): Observable<LocationResponseEntity> | null {
    try {
      return this.http.post<LocationResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`, location, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  editLocation(location: LocationUpdateRequestEntity): Observable<LocationResponseEntity> | null {
    try {
      return this.http.put<LocationResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`, location, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  deleteLocation(id: number): any {
    try {
      return this.http.delete<any>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}/${id}`);
    } catch (error) {

      console.error(error);
      return null;
    }
  }
}
