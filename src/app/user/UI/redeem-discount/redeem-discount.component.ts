import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redeem-discount',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsContainerComponent],
  templateUrl: './redeem-discount.component.html',
  styleUrl: './redeem-discount.component.css'
})
export class RedeemDiscountComponent {

  redeemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService
  ) {
    this.redeemForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.redeemForm.valid ) {
      console.log('Formulario válido:', this.redeemForm.value);
      this._toast.success('Verificando', 'Cedula Recibida', {
        timeOut: 3000,
        progressBar: true,
      });
    } else {
      this._toast.error('Formulario inválido', 'Error al verificar', {
        timeOut: 3000,
        progressBar: true,
      });
    }
  }

  get cedula() { return this.redeemForm.get('cedula'); }

}
