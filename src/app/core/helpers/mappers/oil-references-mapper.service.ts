import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { OilReferenceRequestEntity, OilReferenceUpdateRequestEntity, ViscosityResponseEntity } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class OilReferencesMapperService {

  constructor(private localStorageServ: LocalStorageService,
              private _toastServ: ToastrService) {}

  oilReferenceFromFormToRequest(oilReferenceForm: FormGroup): OilReferenceRequestEntity | null {
    try {
      const adminId = this.localStorageServ.getAdminIdFromStorage()
      if(!adminId) throw new Error('No se pudo obtener el ID del administrador.')
  
      return {
        name: oilReferenceForm.value.name,
        viscosities: oilReferenceForm.value.viscosities,
        adminId
      }
    } catch (error) {
      this._toastServ.error(error + "", 'Error enviando formulario');
      return null;
    }
      
  }
 


  oilReferenceFromObjectToUpdate(idOilReference: number, oilReferenceToUpd: any): OilReferenceUpdateRequestEntity | null{
    try{  

      const adminId = this.localStorageServ.getAdminIdFromStorage()
      if(!adminId) throw new Error('No se pudo obtener el ID del administrador.')

      let objectToReturn: OilReferenceUpdateRequestEntity = {
        adminId,
        id: idOilReference,
        name: oilReferenceToUpd.name,
        viscosities: []
      }

      if(!this.isArrayOfNumbers(oilReferenceToUpd.viscosities)) objectToReturn.viscosities = oilReferenceToUpd.viscosities.map((viscosity: { id: number }) => viscosity.id)
      else objectToReturn.viscosities = oilReferenceToUpd.viscosities
      
      return objectToReturn;
    }

    catch(err){
      this._toastServ.error(err + "", 'Error enviando formulario');
      return null;  
    }
  }

  isArrayOfNumbers(arr: unknown): arr is number[]{
    return Array.isArray(arr) && arr.every(item => typeof item === 'number');
  }
  
}
