import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsContainerComponent } from '../../../layouts/forms-container/forms-container.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { environment } from '../../../../environments/environment.development';
import { ValidatePromotionRequestEntity, ValidatePromotionResponseEntity } from '../../../core/models';
import { PromotionalValidationService } from '../../../core/services';
import { ParseErrorService } from '../../../core/helpers/parse-error.service';

@Component({
  selector: 'app-redeem-discount',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsContainerComponent, SpinnerComponent],
  templateUrl: './redeem-discount.component.html',
  styleUrl: './redeem-discount.component.css'
})
export class RedeemDiscountComponent {

  redeemForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService,
    private router: Router,
    private validateServ: PromotionalValidationService,
    private parseErrorServ: ParseErrorService
  ) {
    this.redeemForm = this.fb.group({
      identification: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    window.addEventListener('popstate', () => {
      history.pushState(null, '', window.location.href);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', () => {})
  }

  onSubmit() {
    this.isLoading = true;
    if(!this.isValidForm()) return;

    const identificationRequest: ValidatePromotionRequestEntity = {identification: this.getIdentification?.value || ''}

    this.validateIdentificationPromise(identificationRequest)?.then((validateResponse: ValidatePromotionResponseEntity) => {
        if(validateResponse) this.successValidation(validateResponse);
      }).catch((error) => {
        this.isLoading = false;
      })
  }  

  isValidForm(): boolean{
    if(this.redeemForm.valid) return true

    this.isLoading = false;
    this._toast.error('Formulario inválido', 'Ingrese una Identification Valida');
    return false;
  }

  private successValidation(validationResponse: ValidatePromotionResponseEntity): void {
    this.isLoading = false;
    this.router.navigate(['/commerce/feedback'], {state: validationResponse, replaceUrl: true});
  }

  private validateIdentificationPromise(identification: ValidatePromotionRequestEntity): Promise<ValidatePromotionResponseEntity> | null {

    return new Promise((resolve, reject) => {

      this.validateServ.validatePromotion(identification)?.subscribe({
        next: (response: ValidatePromotionResponseEntity) => {
          resolve(response);
        },
        error: (error) => {
          this._toast.error(this.parseErrorServ.parseErrorFromBackend(error), 'Error en la validacion');
          reject(null);
        }
      });
    })
  }

  get getIdentification() { return this.redeemForm.get('identification'); }

}
