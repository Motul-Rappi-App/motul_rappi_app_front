import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationRequestEntitie } from '../../../../core/models';
import { JwtLocalManageService } from '../../../../core/services/jwt-local-manage.service';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent implements OnInit {

  @Output() addLocation = new EventEmitter<LocationRequestEntitie>();
  locationForm: FormGroup;

  constructor(private fb: FormBuilder, private jwtService: JwtLocalManageService) {
    this.locationForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])[A-Za-zÁÉÍÓÚáéíóú]+$/) // Al menos una mayúscula, solo letras
        ]
      ],
      adminId: [
        null,
        Validators.required
      ]
    });
  }

  ngOnInit(): void {
    const adminId = this.getAdminIdFromToken();
    if (adminId) {
      this.locationForm.patchValue({ adminId });
      console.log("Admin ID asignado:", adminId);
    } else {
      console.warn("Admin ID no encontrado en el token.");
    }
  }

  private getAdminIdFromToken(): number | null {
    const token = this.jwtService.tokenFromLocal?.token;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload completo:', payload);
        return payload.id || null;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
      }
    }
    console.warn("Token no encontrado en localStorage.");
    return null;
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const newLocation: LocationRequestEntitie = this.locationForm.value;

      console.log('Datos enviados:', JSON.stringify(newLocation, null, 2));
      this.addLocation.emit(newLocation);
      this.locationForm.reset();
    } else {
      console.log('Formulario inválido', this.locationForm);
    }
  }
}
