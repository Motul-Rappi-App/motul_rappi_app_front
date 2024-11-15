import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

import { JwtLocalManageService } from './jwt-local-manage.service';
import { CommerceRequestEntity, CommerceResponseEntity, CommerceUpdateRequestEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {

  private path_back_url = "commerce";

  constructor(private http: HttpClient,
              private jwtServ: JwtLocalManageService
  ) { }

  updateCommerce(commerceUpd: CommerceUpdateRequestEntity): Observable<CommerceResponseEntity> | null{
    try{
      return this.http.put<CommerceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`, commerceUpd, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    }
    catch(err){
      console.error(err);
      return null;
    }
  }

  saveCommerce(commerce: CommerceRequestEntity): Observable<CommerceResponseEntity> | null{
    try{
      return this.http.post<CommerceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`, commerce, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    }
    catch(err){
      console.error(err);
      return null;
    }
  }

  getAllCommerces(): Observable<CommerceResponseEntity[]> | null {
    try {
      const allCommerces: CommerceResponseEntity[] = [];
      const pageSize = 10; 

      const fetchPage = (page: number): Observable<CommerceResponseEntity[]> => {
        return this.http.get<{ content: CommerceResponseEntity[], last: boolean }>(
          `${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`,
          {
            headers: this.jwtServ.tokenInHeaders || new HttpHeaders(),
            params: { page: page.toString(), size: pageSize.toString() }
          }
        ).pipe(
          tap(response => allCommerces.push(...response.content)),
          switchMap(response => response.last ? of(allCommerces) : fetchPage(page + 1))
        );
      };
  
    return fetchPage(0);
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  getCommerceById(id: number): Observable<CommerceResponseEntity> | null {
    try {
      return this.http.get<CommerceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}/${id}`, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }

  editCommerce(commerce: CommerceUpdateRequestEntity): Observable<CommerceResponseEntity> | null {
    try {
      return this.http.put<CommerceResponseEntity>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}`, commerce, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }


  deleteCommerce(id: number): any {
    try {
      return this.http.delete<any>(`${environment.BACKEND_URLS.BACKEND_BASE_URL_1}${this.path_back_url}/${id}`, { headers: this.jwtServ.tokenInHeaders || new HttpHeaders() });
    } catch (error) {

      console.error(error);
      return null;
    }
  }
}
