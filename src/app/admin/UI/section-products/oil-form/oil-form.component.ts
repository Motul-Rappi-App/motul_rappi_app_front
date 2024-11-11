import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Viscosity } from '../../../models/viscosity.model';
import { ViscositiesService } from '../../../services/viscosities.service';
import { CommonModule } from '@angular/common';
import { OilReferenceRequestEntitie, OilReferenceResponseEntitie, ViscosityResponseEntitie } from '../../../../core/models';
import { OilsService } from '../../../services/oils.service';
import { ToastrService } from 'ngx-toastr';
import { OilReferenceUpdateRequestEntitie } from '../../../../core/models/oilReference/OilReferenceUpdateRequest.entitie';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-oil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './oil-form.component.html',
  styleUrls: ['./oil-form.component.css']
})
export class OilFormComponent implements OnInit {

  @Input() selectedOil: OilReferenceResponseEntitie | null = null;
  @Output() addOil = new EventEmitter<OilReferenceRequestEntitie>();
  @Output() updateOil = new EventEmitter<OilReferenceUpdateRequestEntitie>();

  currentId: number = 1;
  oilForm: FormGroup;
  viscositiesList: ViscosityResponseEntitie[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private viscositiesService: ViscositiesService,
    private oilService: OilsService,
    private _toast: ToastrService,
  ) {
    this.oilForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$'), 
          this.noWhitespaceValidator,
          this.noConsecutiveCharactersValidator,
          this.noOnlyNumbersValidator,
        ]
      ],
      viscosities: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.viscositiesService.getViscosities().subscribe(data => {
      this.viscositiesList = data;

      if (this.selectedOil) {
        this.setFormValues(this.selectedOil);
      }
    });
  }

  filteredViscosities(): ViscosityResponseEntitie[] {
    return this.viscositiesList.filter(viscosity =>
      viscosity.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOil'] && this.selectedOil) {
      this.setFormValues(this.selectedOil);
    }
  }

  private setFormValues(oil: OilReferenceResponseEntitie): void {
    this.oilForm.patchValue({
      name: oil.name,
      viscosities: oil.viscosities.map(viscosity => viscosity.description)
    });
  }

  private resetForm(): void {
    this.oilForm.reset();
    this.selectedOil = null;
  }

  onSubmit(): void {
    if (this.oilForm.valid) {
      const oilData = this.selectedOil
        ? {
          id: this.selectedOil.id,
          ...this.oilForm.value,
          adminId: "1"
        }
        : {
          ...this.oilForm.value,
          adminId: "1"
      };

      if (this.selectedOil) {
        this.oilService.updateOil(oilData as OilReferenceUpdateRequestEntitie).subscribe({
          next: () => {
            this._toast.success('Aceite actualizado exitosamente', 'Éxito', environment.TOAST_CONFIG);
            this.resetForm();
          },
          error: (error) => this.handleServiceError(error)
        });
      } else {
        this.oilService.addOil(oilData as OilReferenceRequestEntitie).subscribe({
          next: () => {
            this._toast.success('Aceite añadido exitosamente', 'Éxito', environment.TOAST_CONFIG);
            this.resetForm();
          },
          error: (error) => this.handleServiceError(error)
        });
      }

    } else{
      this._toast.error('Por favor, complete el formulario correctamente', 'Error', environment.TOAST_CONFIG);
    }
  }

  private handleServiceError(error: any): void {
    let errorMessage = 'Ocurrió un error al procesar la solicitud. Intenta nuevamente.';

    if (error.error && error.error.error) {
      errorMessage = error.error.error;
    }

    this._toast.error(errorMessage, 'Error', environment.TOAST_CONFIG);
  }

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  noConsecutiveCharactersValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /(.)\1{2,}/;
    return regex.test(control.value) ? { consecutiveCharacters: true } : null;
  }

  noOnlyNumbersValidator(control: AbstractControl): ValidationErrors | null {
    return /^[0-9]+$/.test(control.value) ? { onlyNumbers: true } : null;
  }

  get name() {
    return this.oilForm.get('name');
  }

  get formTitle(): string {
    return this.selectedOil ? 'Editar Aceite' : 'Añadir Aceite';
  }

  get submitButtonText(): string {
    return this.selectedOil ? 'Atualizar Aceite' : 'Añadir Aceite';
  }

}
