import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationRequestEntitie } from '../../../../core/models';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.css'
})
export class CityFormComponent {

  @Output() addLocation = new EventEmitter<LocationRequestEntitie>();

  locationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])[A-Za-zÁÉÍÓÚáéíóú]{4,50}$/) // Debe contener al menos una mayúscula y solo letras
        ]
      ],
      adminId: [
        null,
        Validators.required
      ]
    });
  }

  private generateAdminId(): number {
    return Math.floor(Math.random() * 100) + 1; // Genera un ID entre 1 y 100
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const newLocation: LocationRequestEntitie = {
        name: this.locationForm.value.name,
        adminId: this.generateAdminId() 
      };
      this.addLocation.emit(newLocation);
      this.locationForm.reset();
    }
  }
}
