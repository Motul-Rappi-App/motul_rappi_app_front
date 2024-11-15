import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { CommerceService } from '../../core/services';
import { ParseErrorService, CommercesMapperService } from '../../core/helpers';
import { CommerceRequestEntity, CommerceResponseEntity, CommerceUpdateRequestEntity } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class CommerceLocalService {
  
  private commercesLocalListSubject = new BehaviorSubject<CommerceResponseEntity[]>([]);
  public commercesLocalList$: Observable<CommerceResponseEntity[]> = this.commercesLocalListSubject.asObservable();


  constructor(private _toastServ: ToastrService,
              private _commerceServ: CommerceService,
              private parseErrorServ: ParseErrorService,
              private commerceMapper: CommercesMapperService
  ) { }

  addCommerceToLocalList(commerce: CommerceResponseEntity): void {
    const currentCommerces = this.commercesLocalListSubject.value;
    this.commercesLocalListSubject.next([...currentCommerces, commerce]);
  }

  addCommercesToLocalEnvironment(commerces: CommerceResponseEntity[]){
    this.commercesLocalListSubject.next(commerces);
  }

  removeCommerceFromLocal(idCommerceUpdated: number){
    const currentCommerces = this.commercesLocalListSubject.value;
    const commercesFiltered = currentCommerces.filter(commerce => commerce.id !== idCommerceUpdated);
    this.commercesLocalListSubject.next(commercesFiltered);
  }


  async saveCommerceInDBAndLocal(commerce: CommerceRequestEntity | null){

    if(!commerce) return
    const commerceFromDB = await this.saveCommerceInDBPromise(commerce);
    if(commerceFromDB) this.addCommerceToLocalList(commerceFromDB);
  }


  updateCommerceInDB(idCommerce: number, selectedCommerce: CommerceResponseEntity, password: string): void {
    
    const commerceUpdate = this.commerceMapper.commerceFromObjectToUpdate(idCommerce, selectedCommerce, password);
    if (!commerceUpdate) {

      this._toastServ.error('Error actualizando comercio', 'Error de actualización');
      return;
    }
    
    this.updateCommerceInDbPromise(commerceUpdate)?.then((commerce) => {

      if(commerce) {
        this._toastServ.success(`Comercio: ${commerceUpdate.name} actualizado con exito`, 'Actualizacion exitosa');
        this.removeCommerceFromLocal(idCommerce);
        this.addCommerceToLocalList(commerce);
      }
    }).catch((err) =>{
      return;
    });
  }


  private updateCommerceInDbPromise(commerce: CommerceUpdateRequestEntity): Promise<CommerceResponseEntity> | null {

    return new Promise((resolve, reject) => {
      this._commerceServ.updateCommerce(commerce)?.subscribe({
        next: (commerce) => {

          resolve(commerce);
        }, error: (err) => {
          this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error actualizando comercio');
          reject(null);
        }
      })
    })
  }

  private saveCommerceInDBPromise(commerce: CommerceRequestEntity): Promise<CommerceResponseEntity> {
    return new Promise((resolve, reject) => {
      this._commerceServ.saveCommerce(commerce)?.subscribe({
        next: (commerce) => {

          this._toastServ.success(`Comercio: ${commerce.name} guardado con exito`, 'Guardado exitoso');
          resolve(commerce);
        }, error: (err) => {

          this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error guardando comercio');
          reject(null);
        }
      })
    })
  }

  onDeleteCommerce(id: number){

    this._commerceServ.deleteCommerce(id)?.subscribe({
      next: () => {

        this._toastServ.success(`Comercio eliminado con exito`, 'Eliminación exitosa');
        this.removeCommerceFromLocal(id);
      }, error: (err: any) => {

        this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error eliminando comercio');
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
