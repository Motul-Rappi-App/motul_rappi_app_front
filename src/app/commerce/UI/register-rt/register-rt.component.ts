import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';

@Component({
  selector: 'app-register-rt',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsContainerComponent],
  templateUrl: './register-rt.component.html',
  styleUrls: ['./register-rt.component.css']
})
export class RegisterRtComponent {

  inscriptionForm: FormGroup;
  brands: string[] = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'KTM', 'BMW', 'Ducati', 'Harley-Davidson', 'Triumph', 'Royal Enfield', 'Otra'];
  displacement: number[] = [50, 100, 110, 115, 120, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 650];
  years: number[] = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService
  ) {
    this.inscriptionForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(8)]],
      nombreCompleto: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/), Validators.maxLength(50)]],
      rappiToken: ['', Validators.required],
      marcaMoto: ['', Validators.required],
      cilindraje: ['', Validators.required],
      anio: ['', Validators.required],
      tiemposMotor: ['', Validators.required],
      referencia: ['', [Validators.required, Validators.maxLength(50)]]
    });    
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      this._toast.success('Formulario enviado con éxito', 'Inscripción realizada', { 
        timeOut: 3000,
        progressBar: true,
      });
      
      console.log('Formulario válido:', this.inscriptionForm.value);
    } else {
      this._toast.error('Formulario inválido', 'Error al enviar', {
        timeOut: 3000,
        progressBar: true,
      });
    }
  }

  get cedula() { return this.inscriptionForm.get('cedula'); }
  get nombreCompleto() { return this.inscriptionForm.get('nombreCompleto'); }
  get rappiToken() { return this.inscriptionForm.get('rappiToken'); }
  get marcaMoto() { return this.inscriptionForm.get('marcaMoto'); }
  get cilindraje() { return this.inscriptionForm.get('cilindraje'); }
  get anio() { return this.inscriptionForm.get('anio'); }
  get tiemposMotor() { return this.inscriptionForm.get('tiemposMotor'); }
  get referencia() { return this.inscriptionForm.get('referencia'); }

}