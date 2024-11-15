import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtLocalManageService } from './jwt-local-manage.service';
import { environment } from '../../../environments/environment.development';
import { RappiCourierRequestEntity } from '../models/rappiCourier/RappiCourierRequest.entity';
import { MotorcycleRequestEntity, MotorcycleResponseEntity, RappiCourierResponseEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RappiCourierService {

  private path_back_url_rt = "rappiCourier";
  private path_back_url_motorcycle = "motorcycle";
  constructor(private http: HttpClient,
              private jwtServ: JwtLocalManageService
  ) { }

  createRappiCourier(
    identification: string, 
    fullName: string, 
    rappiToken: string, 
    commerceId: number, 
    motorcycle: MotorcycleRequestEntity
  ): Observable<RappiCourierResponseEntity | null> {
    return from(this.getRappiCourierRequestWithAllAttributes(identification, fullName, rappiToken, motorcycle, commerceId)).pipe(
      switchMap((rtRequestEntity) => 
        this.http.post<RappiCourierResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_rt}`, rtRequestEntity, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() })
      ),
      catchError((error) => {

        console.error('Error en createRappiCourier:', error);
        return of(null);
      })
    );
  }

  getRappiCourierRequestWithAllAttributes(
    identification: string, 
    fullName: string, 
    rappiToken: string, 
    motorcycle: MotorcycleRequestEntity, 
    commerceId: number
  ): Promise<RappiCourierRequestEntity> {
    return new Promise<RappiCourierRequestEntity>((resolve, reject) => {
      try {
        this.createMotorcycle(motorcycle)?.subscribe({
          next: (motorcycle) => {
            resolve({ identification, fullName, rappiToken, commerceId, motorcycleId: motorcycle.id });
          },
          error: (error) => {
            
            console.error('Error en getRappiCourierRequestWithAllAttributes:', error);
            reject(error);
          }
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  createMotorcycle(motorcycle: MotorcycleRequestEntity): Observable<MotorcycleResponseEntity> | null {
    try {
      return this.http.post<MotorcycleResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url_motorcycle}`, motorcycle, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
