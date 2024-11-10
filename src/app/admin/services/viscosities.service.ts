import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Viscosity } from '../models/viscosity.model';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtLocalManageService } from '../../core/services/jwt-local-manage.service';
import { map } from 'rxjs/operators';
import { ViscosityResponseEntitie } from '../../core/models';
import { ViscosityRequestEntitie } from '../../core/models/viscosity/ViscosityRequest.entitie';
import { ViscosityUpdateRequestEntitie } from '../../core/models/viscosity/ViscosityUpdateRequest.entitie';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ViscositiesService {

  private base_back_url: string = `${environment.BACKEND_BASE_URL}viscosity`;

  constructor(
    private http: HttpClient,
    private jwtServ: JwtLocalManageService,
    private _toast: ToastrService,
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const headers = this.jwtServ.tokenInHeaders;
    if (!headers) {
      throw new Error('Authorization headers not found');
    }
    return headers;
  }

  getViscosities(): Observable<ViscosityResponseEntitie[]> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<{ content: ViscosityResponseEntitie[] }>(this.base_back_url, { headers })
        .pipe(
          map(response => response.content)
        );
    } catch (error) {
      this._toast.error('Error al obtener las viscosidades', 'Error', environment.TOAST_CONFIG);
      return of([]);
    }
  }
  
  getViscosityById(id: string): Observable<ViscosityResponseEntitie> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.get<ViscosityResponseEntitie>(`${this.base_back_url}/${id}`, { headers });
    }catch(error){
      this._toast.error('Error al obtener la viscosidad', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }

  addViscosity(viscosity: ViscosityRequestEntitie): Observable<ViscosityResponseEntitie> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.post<ViscosityResponseEntitie>(this.base_back_url, viscosity, { headers });
    } catch (error) {
      this._toast.error('Error al agregar la viscosidad', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }

  updateViscosity(viscosity: ViscosityUpdateRequestEntitie): Observable<ViscosityResponseEntitie> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.put<ViscosityResponseEntitie>(this.base_back_url, viscosity, { headers });
    } catch (error) {
      this._toast.error('Error al actualizar la viscosidad', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }

  deleteViscosity(id: string): Observable<void> {
    try{
      const headers = this.getAuthHeaders();
      return this.http.delete<void>(`${this.base_back_url}/${id}`, { headers });
    } catch (error) {
      this._toast.error('Error al eliminar la viscosidad', 'Error', environment.TOAST_CONFIG);
      return of();
    }
  }
}
