import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { OilReferenceRequestEntitie, OilReferenceResponseEntitie } from '../../core/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtLocalManageService } from '../../core/services/jwt-local-manage.service';
import { ToastrService } from 'ngx-toastr';
import { OilReferenceUpdateRequestEntitie } from '../../core/models/oilReference/OilReferenceUpdateRequest.entitie';

@Injectable({
  providedIn: 'root'
})
export class OilsService {

  private base_back_url: string = `${environment.BACKEND_BASE_URL}oilReference`;

  constructor(
    private http: HttpClient,
    private jwtServ: JwtLocalManageService,
    private _toast: ToastrService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const headers = this.jwtServ.tokenInHeaders;
    if (!headers) { throw new Error('Authorization headers not found') }
    return headers;
  }

  getOils(): Observable<OilReferenceResponseEntitie[]> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<{ content: OilReferenceResponseEntitie[] }>(this.base_back_url, { headers })
        .pipe(
          map(response => response.content)
        );
    } catch (error) {
      this._toast.error('Error al obtener los Aceites', 'Error', environment.TOAST_CONFIG);
      return of([]);
    }
  }
  
  getOilById(id: string): Observable<OilReferenceResponseEntitie> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.get<OilReferenceResponseEntitie>(`${this.base_back_url}/${id}`, { headers });
    }catch(error){
      this._toast.error('Error al obtener el Aceite', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }

  addOil(oil: OilReferenceRequestEntitie): Observable<OilReferenceResponseEntitie> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.post<OilReferenceResponseEntitie>(this.base_back_url, oil, { headers });
    } catch (error) {
      this._toast.error('Error al agregar el Aceite', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }

  updateOil(oil: OilReferenceUpdateRequestEntitie): Observable<OilReferenceResponseEntitie> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.put<OilReferenceResponseEntitie>(this.base_back_url, oil, { headers });
    } catch (error) {
      this._toast.error('Error al actualizar el Aceite', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }

  deleteOil(id: number): Observable<void> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.delete<void>(`${this.base_back_url}/${id}`, { headers });
    } catch (error) {
      this._toast.error('Error al eliminar el Aceite', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }
}
