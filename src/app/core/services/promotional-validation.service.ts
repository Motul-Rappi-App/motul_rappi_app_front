import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ValidatePromotionResponseEntity } from '../models';
import { JwtLocalManageService } from './jwt-local-manage.service';
import { environment } from '../../../environments/environment.development';
import { ValidatePromotionRequestEntity } from '../models/validatePromotion/ValidatePromotionRequest.entity';

@Injectable({
  providedIn: 'root'
})
export class PromotionalValidationService {

  private path_back_url = "validatepromotion";
  constructor(private http: HttpClient,
              private jwtServ: JwtLocalManageService
  ) { }

  validatePromotion(validatePromotionRequest: ValidatePromotionRequestEntity): Observable<ValidatePromotionResponseEntity> | null{
    try {
      return this.http.post<ValidatePromotionResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_3}${this.path_back_url}`, validatePromotionRequest,{ headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
