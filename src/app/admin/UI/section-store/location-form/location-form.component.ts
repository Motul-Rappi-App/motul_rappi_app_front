import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment.development';
import { LocationRequestEntitie } from '../../../../core/models';
import { JwtLocalManageService } from '../../../../core/services/jwt-local-manage.service';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent {

  @Output() addLocation = new EventEmitter<LocationRequestEntitie>();
  locationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtLocalManageService,
    private _toast: ToastrService,
  ) {
    this.locationForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])[A-Za-zÁÉÍÓÚáéíóú]+$/)
        ]
      ],
    });
  }


  onSubmit(): void {
    if (this.locationForm.valid) {
      const newLocation: LocationRequestEntitie = this.locationForm.value;

      const location = {
        name: newLocation.name,
        adminId: 1
      }

      this.addLocation.emit(location);
      this._toast.success('Ubicación añadida', 'Éxito', environment.TOAST_CONFIG);
      this.locationForm.reset();
    } else {
      this._toast.error('Formulario inválido', 'Error', environment.TOAST_CONFIG);
    }
  }
}
