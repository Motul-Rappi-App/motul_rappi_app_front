import { Component } from '@angular/core';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsContainerComponent, RecaptchaModule, CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgetForm: FormGroup;
  recaptchaResolved: boolean = false;
  recaptchaSiteKey: string = '6LfZaHcqAAAAANhjYSvv2qF8VZGnnY6FNUtV__ED';
  showSuccessModal: boolean = false;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      recaptcha: ['', Validators.required]
    })
  }

  passwordMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword === confirmPassword ? null : { passwordMismatch: true };
  };

  resolved(captchaResponse: string | null): void {
    this.recaptchaResolved = !!captchaResponse;
    this.forgetForm.controls['recaptcha'].setValue(captchaResponse);
  }


  onSubmit(): void {
    if (this.forgetForm.valid) {
      console.log('Formulario enviado:', this.forgetForm.value);
      this.showSuccessModal = true;
    }
  }

  closeModal(): void {
    this.showSuccessModal = false;
  }
}
