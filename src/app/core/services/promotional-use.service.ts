import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { environment } from '../../../environments/environment.development';
import { RtPromotionalUsesRequestEntity, RtPromotionalUsesResponseEntity, SoatPromotionalUsesRequestEntity, SoatPromotionalUsesResponseEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PromotionalUseService {

  private path_rt_back_url = "rtpromotionaluses";
  private path_soat_back_url = "soatpromotionaluses";

  constructor(private http: HttpClient,
              private jwtServ: JwtLocalManageService
  ) { }

  saveRtPromotionalUse(rtPromotionalUse: RtPromotionalUsesRequestEntity): Observable<RtPromotionalUsesResponseEntity> | null{
    try {
      return this.http.post<RtPromotionalUsesResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_2}${this.path_rt_back_url}`, rtPromotionalUse, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  saveSoatPromotionalUse(soatPromotionalUse: SoatPromotionalUsesRequestEntity): Observable<SoatPromotionalUsesResponseEntity> | null{
    try {
      return this.http.post<SoatPromotionalUsesResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_2}${this.path_soat_back_url}`, soatPromotionalUse, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {
      
      console.error(error);
      return null;
    }
  }
}
