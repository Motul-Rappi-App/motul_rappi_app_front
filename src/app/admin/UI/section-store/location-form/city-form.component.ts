import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { LocationsLocalService } from '../../../services';
import { LocalStorageService, LocationService } from '../../../../core/services';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent{

  locationForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private localServ: LocalStorageService,
              private locationsLocalServ: LocationsLocalService,
              private _toastServ: ToastrService,
              private locationServ: LocationService) {

    this.locationForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])[A-Za-zÁÉÍÓÚáéíóú]+$/) // Al menos una mayúscula, solo letras
        ]
      ],
      adminId: [null]
    });
  }

  async onSubmit() {
    this.setAdminIdToForm()
    if (!this.validateForm()) return;

    const location = await this.locationsLocalServ.saveLocationInDb(this.locationForm.value);
    
    this.locationsLocalServ.addLocationToLocalEnvironment( location ); 
    this.locationForm.reset();    
  }

  setAdminIdToForm(){
    const adminId = this.localServ.getAdminIdFromStorage();

    if (adminId) this.locationForm.patchValue({ adminId });
    else this._toastServ.error('No se pudo obtener el ID del administrador.', 'Error enviando formulario');
  }

  private validateForm(): boolean{
    if (this.locationForm.valid) return true
    this._toastServ.error('Formulario inválido', 'Error enviando formulario');
    return false;
  }
}
