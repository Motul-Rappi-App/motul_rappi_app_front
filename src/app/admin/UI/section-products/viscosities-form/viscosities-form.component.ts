import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Viscosity } from '../../../models/viscosity.model';
import { CommonModule } from '@angular/common';
import { ViscosityRequestEntitie } from '../../../../core/models';

@Component({
  selector: 'app-viscosities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viscosities-form.component.html',
  styleUrl: './viscosities-form.component.css'
})
export class ViscositiesFormComponent {
  @Output() addViscosity = new EventEmitter<ViscosityRequestEntitie>();

  viscosityForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.viscosityForm = this.fb.group({
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9 ]+$'),
          this.noWhitespaceValidator,
          this.noConsecutiveCharactersValidator,
          this.noOnlyNumbersValidator,
        ]
      ]
    });
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

  onSubmit(): void {
    if (this.viscosityForm.valid) {
      const newViscosity: ViscosityRequestEntitie = this.viscosityForm.value;
    
      const viscosity = {
        description: newViscosity.description,
        adminId: 1
      }

      this.addViscosity.emit(viscosity);
      this.viscosityForm.reset();
    } else {
      console.log('Formulario inválido', this.viscosityForm);
    }
  }
}
