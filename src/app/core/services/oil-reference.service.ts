import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { environment } from '../../../environments/environment.development';
import { OilReferenceRequestEntity, OilReferenceResponseEntity, OilReferenceUpdateRequestEntity, ViscosityRequestEntity, ViscosityResponseEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OilReferenceService {

  private path_back_url_oil = "oilReference";
  private path_back_url_viscosity = "viscosity";
  constructor(private http: HttpClient,
              private jwtServ: JwtLocalManageService
  ) {}

  createOilReference(oilReference: OilReferenceRequestEntity): Observable<OilReferenceResponseEntity> | null {
    try {
      return this.http.post<OilReferenceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_oil}`, oilReference, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });  
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  updateOilReference(oilReference: OilReferenceUpdateRequestEntity): Observable<OilReferenceResponseEntity> | null {
    try {
      console.log(oilReference)
      return this.http.post<OilReferenceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_oil}`, oilReference, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }



  getAllOilReferences(): Observable<OilReferenceResponseEntity[]> | null {
    try {
      
      const allOilReferences: OilReferenceResponseEntity[] = [];
      const pageSize = 10; 
      const fetchPage = (page: number): Observable<OilReferenceResponseEntity[]> => {
            return this.http.get<{ content: OilReferenceResponseEntity[], last: boolean }>(
              `${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_oil}`,
              {
                headers: this.jwtServ.tokenInHeaders || new HttpHeaders(),
                params: { page: page.toString(), size: pageSize.toString() }
              }
            ).pipe(
              tap(response => allOilReferences.push(...response.content)),
              switchMap(response => response.last ? of(allOilReferences) : fetchPage(page + 1))
            );
          };
      return fetchPage(0);
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  getOilReferenceById(id: string): Observable<OilReferenceResponseEntity> | null {
    try {
      return this.http.get<OilReferenceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_oil}/${id}`, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  deleteOilReference(id: string): any {
    try {
      return this.http.delete(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_oil}/${id}`, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }



  getAllViscosities(): Observable<ViscosityResponseEntity[]> | null {
    try {
      const allViscosities: ViscosityResponseEntity[] = [];
      const pageSize = 10; 
      const fetchPage = (page: number): Observable<ViscosityResponseEntity[]> => {
            return this.http.get<{ content: ViscosityResponseEntity[], last: boolean }>(
              `${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_viscosity}`,
              {
                headers: this.jwtServ.tokenInHeaders || new HttpHeaders(),
                params: { page: page.toString(), size: pageSize.toString() }
              }
            ).pipe(
              tap(response => allViscosities.push(...response.content)),
              switchMap(response => response.last ? of(allViscosities) : fetchPage(page + 1))
            );
          };
      return fetchPage(0);
    } catch (error) {

      console.error(error);
      return null;
    }
  }


  createViscosity(viscosity: ViscosityRequestEntity): Observable<ViscosityResponseEntity> | null {
    try {
      return this.http.post<ViscosityResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_viscosity}`, viscosity, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  deleteViscosity(id: string): any{
    try {
      return this.http.delete<any>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_viscosity}/${id}`, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }
}
