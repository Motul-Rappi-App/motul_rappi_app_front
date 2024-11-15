import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtLocalManageService, OilReferenceService } from '../../core/services';
import { environment } from '../../../environments/environment.development';
import { OilReferenceUpdateRequestEntity, OilReferenceRequestEntity, OilReferenceResponseEntity } from '../../core/models';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { OilReferencesMapperService, ParseErrorService } from '../../core/helpers';


@Injectable({
  providedIn: 'root'
})
export class OilsLocalService {

  private oilReferencesLocalListSubject = new BehaviorSubject<OilReferenceResponseEntity[]>([]); 
  public oilReferencesLocalList$: Observable<OilReferenceResponseEntity[]> = this.oilReferencesLocalListSubject.asObservable(); 

  constructor(
    private _toastServ: ToastrService,
    private parseErrorServ: ParseErrorService,
    private oilReferenceServ: OilReferenceService,
    private oilReferenceMapper: OilReferencesMapperService,
  ) { }
  
  addOilReferenceToLocalList(commerce: OilReferenceResponseEntity): void {
    const currentCommerces = this.oilReferencesLocalListSubject.value;
    this.oilReferencesLocalListSubject.next([...currentCommerces, commerce]);
  }

  addOilReferencesToLocalEnvironment(commerces: OilReferenceResponseEntity[]){
    this.oilReferencesLocalListSubject.next(commerces);
  }

  removeOilReferenceFromLocal(idOilReference: number){
    const currentOilReferences = this.oilReferencesLocalListSubject.value;
    const oilReferencesFiltered = currentOilReferences.filter(reference => reference.id !== idOilReference);
    this.oilReferencesLocalListSubject.next(oilReferencesFiltered);
  }

  async saveOilReferenceInDbAndLocal(oilReference: OilReferenceRequestEntity | null){
    if(!oilReference) return;
    const oilRefFromDB = await this.saveOilRefInDBPromise(oilReference);
    if(oilRefFromDB) this.addOilReferenceToLocalList(oilRefFromDB)
  }

  updateOilReferenceInDb(idOilRef: number, selectedOil: OilReferenceResponseEntity): void{

    const oilRefUpd = this.oilReferenceMapper.oilReferenceFromObjectToUpdate(idOilRef, selectedOil);
    if(!oilRefUpd){
      this._toastServ.error('Error actualizando referencia de aceite', 'Error de actualización');
      return
    }

    this.updateOilReferenceInDbPromise(oilRefUpd)?.then((oilReference) => {

      if(oilReference){
        this._toastServ.success(`Referencia de aceite: ${oilReference.name} actualizada con exito`, 'Actualizacion exitosa');
        this.removeOilReferenceFromLocal(oilReference.id);
        this.addOilReferenceToLocalList(oilReference);
      }
    }).catch((err)=>{
      return;
    })
  }

  private updateOilReferenceInDbPromise(oilReference: OilReferenceUpdateRequestEntity): Promise<OilReferenceResponseEntity> | null {
    return new Promise((resolve, reject) => {
      this.oilReferenceServ.updateOilReference(oilReference)?.subscribe({
        next: (oilReference) => {

          resolve(oilReference);
        }, error: (err) => {
          this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error actualizando referencia');
          reject(null);
        }
      })
    })
  }


  private saveOilRefInDBPromise(oilReference: OilReferenceRequestEntity): Promise<OilReferenceResponseEntity> {
    return new Promise((resolve, reject) => {
    this.oilReferenceServ.createOilReference(oilReference)?.subscribe({
        next: (oilRef) => {
        
          this._toastServ.success(`Referencia: ${oilRef.name} guardada con exito`, 'Guardado exitoso');
          resolve(oilRef);
        }, error: (err) => {

          this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error guardando referencia');
          reject(null);
        }
      })
    })
  }

  onDeleteOil(id: number){

    this.oilReferenceServ.deleteOilReference(id + "")?.subscribe({
      next: () => {

        this._toastServ.success(`Referencia eliminada con exito`, 'Eliminación exitosa');
        this.removeOilReferenceFromLocal(id);
      }, error: (err: any) => {

        this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error eliminando referencia');
      }
    })
  }


  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  noConsecutiveCharactersValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /(.)\1{2,}/;
    return regex.test(control.value) ? { consecutiveCharacters: true } : null;
  }

  noOnlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
    return /^[0-9]+$/.test(control.value) ? { onlyNumbers: true } : null;
  }
}
