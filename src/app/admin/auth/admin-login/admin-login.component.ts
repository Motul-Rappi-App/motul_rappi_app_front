import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { SpinnerComponent } from "../../../shared/spinner/spinner.component";
import { environment } from '../../../../environments/environment.development';
import { LocalStorageService, AuthService, JwtLocalManageService } from '../../../core/services';
import {  AuthenticationRequestEntity, AuthenticationResponseEntity } from '../../../core/models';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule, FormsContainerComponent, SpinnerComponent],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup;
  captchaResolved: boolean = false;
  recaptchaSiteKey: string = environment.CAPTCHA_KEY; 
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService,
    private router: Router,
    private jwtServ: JwtLocalManageService,
    private localServ: LocalStorageService,
    private authServ: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$")]]
    });
  }

  ngOnInit(): void {
    //this.verifyIfLoggedIn();
  }

  verifyIfLoggedIn(): void {
    // this.isLoading = true;

  }

  resolved(captchaResponse: string | null) {

    if (captchaResponse === null) {
      this._toast.error('Error al validar captcha', 'Error', environment.TOAST_CONFIG);
      this.captchaResolved = false;
      return;
    }

    this.captchaResolved = true;
  }

  onSubmit() {

    if (this.validateIsFormInvalid) {
      this.invalidForm();
      return;
    }
    this.isLoading = true;
    this.sendFormToValidateCredentials();
  }

  sendFormToValidateCredentials(){
    const authRequest: AuthenticationRequestEntity = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.authServ.login(authRequest)!.subscribe({
      next: (data) => {
        this.isLoading = false;
        this.successLogin(data);
      },error: (err) => {

        this.isLoading = false;
        console.log(err)
        this.noSuccessLogin(err.error.error);
      }}) 
  }

  validateErrorMessage(err: string){
    if(err === "Bad credentials") return "Correo o Contraseña incorrecto";
    else return null
  }

  noSuccessLogin(error: string){
    
    let errorToShow = this.validateErrorMessage(error);
    if(!errorToShow) errorToShow = error;
    this._toast.error('Error iniciando sesión', errorToShow, environment.TOAST_CONFIG);
  }

  successLogin(data: AuthenticationResponseEntity){
    this._toast.success('Bienvenido', 'Ingreso exitoso', environment.TOAST_CONFIG);
    
    this.localServ.setCredentialsToLocal(data);
    this.jwtServ.setTokenToLocal(data.token);
    this.router.navigate(['/admin/lobby-admin']);
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
