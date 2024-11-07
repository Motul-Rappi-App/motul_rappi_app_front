import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Viscosity } from '../../../models/viscosity.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viscosities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viscosities-form.component.html',
  styleUrl: './viscosities-form.component.css'
})
export class ViscositiesFormComponent {
  @Output() addViscosity = new EventEmitter<Viscosity>();

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
      const newViscosity: Viscosity = {
        id: Math.random().toString(36).substring(2),
        description: this.viscosityForm.value.description,
        idAdmin: '1'
      };
      this.addViscosity.emit(newViscosity);
      this.viscosityForm.reset();
    }
  }
}
