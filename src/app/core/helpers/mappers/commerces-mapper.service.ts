import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services';
import { FormGroup } from '@angular/forms';
import { CommerceRequestEntity, CommerceUpdateRequestEntity } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommercesMapperService {

  constructor(  private localStorageServ: LocalStorageService,
                private _toastServ: ToastrService
  ) { }

  commerceFromFormToRequest(commerceForm: FormGroup): CommerceRequestEntity | null {
    try {
      const adminId = this.localStorageServ.getAdminIdFromStorage()
      if(!adminId) throw new Error('No se pudo obtener el ID del administrador.')
  
      return {
        name: commerceForm.value.name,
        nit: commerceForm.value.nit,
        email: commerceForm.value.email,
        password: commerceForm.value.password,
        locationId: parseInt(commerceForm.value.cities),
        adminId
      }
    } catch (error) {
      this._toastServ.error(error + "", 'Error enviando formulario');
      return null;
    }
      
  }
 


  commerceFromObjectToUpdate(idCommerce: number, commerceToUpd: any, password: string): CommerceUpdateRequestEntity | null{
    try{
      return {
        id: idCommerce,
        name: commerceToUpd.name,
        nit: commerceToUpd.nit,
        locationId: commerceToUpd.cities,
        password,
        }
      }
    catch(err){
      this._toastServ.error(err + "", 'Error enviando formulario');
      return null;  
    }
  }

}
