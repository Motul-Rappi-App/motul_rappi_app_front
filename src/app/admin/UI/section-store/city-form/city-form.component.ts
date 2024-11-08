import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitiesService } from '../../../services/cities.service';
import { City } from '../../../models/city.model';
import { FormsContainerComponent } from '../../../../layouts/forms-container/forms-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, FormsContainerComponent, ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.css'
})
export class CityFormComponent {

  @Output() addCity = new EventEmitter();

  cityForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cityForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      const newCity: City = {
        id: Math.random().toString(36).substring(2),
        name: this.cityForm.value.name,
        idAdmin: '1'
      };
      this.addCity.emit(newCity);
      this.cityForm.reset();
    }
  }
}
