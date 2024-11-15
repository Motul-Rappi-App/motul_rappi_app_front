import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ViscosityResponseEntity } from '../../core/models';
import { ViscosityRequestEntity } from '../../core/models/viscosity/ViscosityRequest.entity';
import { ToastrService } from 'ngx-toastr';
import { OilReferenceService } from '../../core/services';
import { ParseErrorService } from '../../core/helpers';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ViscositiesLocalService {

  private viscositiesLocalListSubject = new BehaviorSubject<ViscosityResponseEntity[]>([]); 
  public viscositiesLocalList$: Observable<ViscosityResponseEntity[]> = this.viscositiesLocalListSubject.asObservable();

  constructor(
    private _toast: ToastrService,
    private parseErrorServ: ParseErrorService,
    private OilReferenceServ: OilReferenceService,
  ) { }

  addViscositieToLocalList(viscosity: ViscosityResponseEntity): void {
    const currentViscosities = this.viscositiesLocalListSubject.value;
    this.viscositiesLocalListSubject.next([...currentViscosities, viscosity]);
  }

  addViscositiesFromDbToLocalList(viscocities: ViscosityResponseEntity[]): void {
    this.viscositiesLocalListSubject.next(viscocities);
  }

  addViscocityToLocalEnvironment(viscosity: ViscosityResponseEntity | null): void {
    if(viscosity) this.addViscositieToLocalList(viscosity);
    else this._toast.error('Error guardando viscosidad en lista local', 'Error actualizando informacion');
  }

  saveViscosityInDb(viscosity: ViscosityRequestEntity): Promise<ViscosityResponseEntity> | null {

    return new Promise((resolve, reject) => {

      this.OilReferenceServ.createViscosity(viscosity)?.subscribe({
        next: (visc) => {

          this._toast.success(`Viscosidad: ${visc.description} guardada con exito`, 'Guardado exitoso');
          resolve(visc);
        }, error: (err) => {

          this._toast.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error guardando Viscosidad');
          reject(null);
        }
      })
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
