import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsContainerComponent } from "../../../layouts/forms-container/forms-container.component";
import { Router } from '@angular/router';
import { JwtLocalManageService } from '../../../core/services/jwt-local-manage.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthenticationRequestEntitie, AuthenticationResponseEntitie } from '../../../core/models';
import { environment } from '../../../../environments/environment.development';


@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule, FormsContainerComponent],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  loginForm: FormGroup;
  captchaResolved: boolean = false;
  recaptchaSiteKey: string = '6LfZaHcqAAAAANhjYSvv2qF8VZGnnY6FNUtV__ED'; 


  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService,
    private router: Router,
    private jwtServ: JwtLocalManageService,
    private authServ: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  resolved(captchaResponse: string | null) {

    if (captchaResponse === null) {
      this._toast.error('Error al validar captcha', 'Error',environment.TOAST_CONFIG);
      this.captchaResolved = false;
      return;
    }

    this.captchaResolved = true;
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  onSubmit() {
    if (this.validateIsFormInvalid) {
      this.invalidForm();
      return;
    }

    this.sendFormToValidateCredentials();
  }

  sendFormToValidateCredentials(){
    const authRequest: AuthenticationRequestEntitie = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.authServ.login(authRequest)!.subscribe({
      next: (data) => {
        this.successLogin(data);
      },
      error: (err) => {
        console.log(err)
        this.noSuccessLogin(err.error);
        }
      }) 
  }

  noSuccessLogin(error: string){
    this._toast.error('Error iniciando sesión', error, environment.TOAST_CONFIG);
  }

  successLogin(data: AuthenticationResponseEntitie){
     this._toast.success('Bienvenido', 'Ingreso exitoso', environment.TOAST_CONFIG);
      this.jwtServ.setTokenToLocal(data.token);
      this.router.navigate(['/admin/lobby']);
  }

  invalidForm(){
    this._toast.error('Formulario inválido', 'Por favor complete los campos de forma correcta', environment.TOAST_CONFIG);
  }

  get validateIsFormInvalid() {
    return !this.loginForm.valid && !this.captchaResolved;
  }

  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }

}
