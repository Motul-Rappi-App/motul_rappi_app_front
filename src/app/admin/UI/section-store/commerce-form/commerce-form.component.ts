import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommerceRequestEntitie, CommerceResponseEntitie, CommerceUpdateRequestEntitie, LocationResponseEntitie } from '../../../../core/models';
import { LocationsService } from '../../../services/locations.service';
import { CommerceService } from '../../../services/commerce.service'; // Importa el servicio correctamente
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commerce-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-form.component.html',
  styleUrl: './commerce-form.component.css'
})
export class CommerceFormComponent implements OnInit {

  @Input() selectedCommerce: CommerceResponseEntitie | null = null;

  commerceForm: FormGroup;
  locationsList: LocationResponseEntitie[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private locationsService: LocationsService,
    private commerceService: CommerceService, // Asegúrate de tener el servicio disponible
    private _toast: ToastrService,
  ) {
    this.commerceForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])[A-Za-zÁÉÍÓÚáéíóú0-9]{1,50}$'),
        this.noWhitespaceValidator
      ]],
      locationId: [null, Validators.required],
      nit: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{9,12}$'),
        Validators.minLength(1),
        Validators.maxLength(20)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$')
      ]]
    });
  }

  ngOnInit(): void {
    this.locationsService.getLocations().subscribe(data => {
      this.locationsList = data;

      if (this.selectedCommerce) {
        this.setFormValues(this.selectedCommerce);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCommerce'] && this.selectedCommerce && this.locationsList.length > 0) {
      this.setFormValues(this.selectedCommerce);
    }
  }

  private setFormValues(commerce: CommerceResponseEntitie): void {
    this.commerceForm.patchValue({
      name: commerce.name,
      locationId: commerce.location ? commerce.location.id : null,
      nit: commerce.nit,
      email: commerce.email,
      password: commerce.password
    });
  }

  private resetForm(): void {
    this.commerceForm.reset();
    this.selectedCommerce = null;
  }

  onSubmit(): void {
    if (this.commerceForm.valid) {
      const commerceData = this.selectedCommerce
        ? {
          id: this.selectedCommerce.id,
          ...this.commerceForm.value,
          adminId: "1"
        }
        : {
          ...this.commerceForm.value,
          adminId: "1"
        };

      if (this.selectedCommerce) {
        this.commerceService.updateCommerce(commerceData as CommerceUpdateRequestEntitie).subscribe({
          next: () => {
            this._toast.success('Comercio actualizado exitosamente', 'Éxito');
            this.resetForm();
          },
          error: (error) => this.handleServiceError(error)
        });
      } else {
        this.commerceService.addCommerce(commerceData as CommerceRequestEntitie).subscribe({
          next: () => {
            this._toast.success('Comercio añadido exitosamente', 'Éxito');
            this.resetForm();
          },
          error: (error) => this.handleServiceError(error)
        });
      }
    } else {
      this._toast.error('Por favor, complete el formulario correctamente', 'Error');
    }
  }

  private handleServiceError(error: any): void {
    let errorMessage = 'Ocurrió un error al procesar la solicitud. Intenta nuevamente.';

    // Verificamos si el mensaje de error específico está en error.error.error
    if (error.error && error.error.error) {
      // Captura el mensaje de error específico del backend
      errorMessage = error.error.error;
    }

    this._toast.error(errorMessage, 'Error');
  }


  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  get name() {
    return this.commerceForm.get('name');
  }

  get formTitle(): string {
    return this.selectedCommerce ? 'Editar Comercio' : 'Añadir Comercio';
  }

  get submitButtonText(): string {
    return this.selectedCommerce ? 'Actualizar Comercio' : 'Añadir Comercio';
  }
}
