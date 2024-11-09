import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    private _toast: ToastrService,
    private router: Router
  ) {
    this.redeemForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.redeemForm.valid) {
      const cedulaValue = this.getCedula?.value || '';
  
      // Llamada a la función de validación de cédula (simulada)
      this.validateCedula(cedulaValue).then(isValid => {

        const message = isValid 
          ? '¡La cédula es válida!' 
          : '¡La cédula es inválida o no está registrada en el sistema!';


        // Redirigimos al componente feedback-discount con el estado
        this.router.navigate(['/sellers/feedback'], { 
          state: { cedula: cedulaValue, valid: isValid, message: message }
        });
      });
    } else {
      this._toast.error('Formulario inválido', 'Error al verificar', {
        timeOut: 3000,
        progressBar: true,
      });
    }
  }  

  validateCedula(cedula: string): Promise<boolean> {
    // Simulación de la validación de cédula
    // Supongamos que una cédula válida para la promoción es aquella que empieza con 1
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(cedula.startsWith('1')); // Simulamos que las cédulas que empiezan con '1' son válidas
      }, 1000); // Simulamos un retraso de 1 segundo
    });
  }

  get getCedula() { return this.redeemForm.get('cedula'); }

}
