import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule, FormsContainerComponent],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  loginForm: FormGroup;
  captchaResolved: boolean = false;
  recaptchaSiteKey: string = '6LfZaHcqAAAAANhjYSvv2qF8VZGnnY6FNUtV__ED'; 

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  resolved(captchaResponse: string | null) {

    if (captchaResponse === null) {
      this._toast.error('Error al validar captcha');
      this.captchaResolved = false;
      return;
    }

    this.captchaResolved = true;
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  onSubmit() {
    if (this.loginForm.valid && this.captchaResolved) {
      // console.log('Formulario válido:', this.loginForm.value);
      this._toast.success('Bienvenido');
    } else {
      this._toast.error('Formulario inválido');
      // console.log('Formulario inválido');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
