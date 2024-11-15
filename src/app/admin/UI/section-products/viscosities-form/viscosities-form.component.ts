import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViscosityRequestEntity } from '../../../../core/models';
import { ViscositiesLocalService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../../../core/services';

@Component({
  selector: 'app-viscosities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viscosities-form.component.html',
  styleUrl: './viscosities-form.component.css'
})
export class ViscositiesFormComponent {
  viscosityForm: FormGroup;

  constructor(private fb: FormBuilder,
              private viscosityLocalServ: ViscositiesLocalService,
              private _toastServ: ToastrService,
              private localServ: LocalStorageService
  ) {
    this.viscosityForm = this.fb.group({
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9 ]+$'),
          this.viscosityLocalServ.noWhitespaceValidator,
          this.viscosityLocalServ.noConsecutiveCharactersValidator,
          this.viscosityLocalServ.noOnlyNumbersValidator,
        ]
      ],
      adminId: [null]
    });
  }

  async onSubmit(){
    this.setAdminIdToForm()
    if (!this.validateForm()) return;

      const newViscosity = await this.viscosityLocalServ.saveViscosityInDb(this.viscosityForm.value);
      this.viscosityLocalServ.addViscocityToLocalEnvironment(newViscosity);
      this.viscosityForm.reset();
  }

  setAdminIdToForm(){
    const adminId = this.localServ.getAdminIdFromStorage();

    if (adminId) this.viscosityForm.patchValue({ adminId });
    else this._toastServ.error('No se pudo obtener el ID del administrador.', 'Error enviando formulario');
  }

  private validateForm(): boolean{
    if(this.viscosityForm.valid) return true
    this._toastServ.error('Formulario inválido', 'Error enviando formulario');
    return false;
  }

}
