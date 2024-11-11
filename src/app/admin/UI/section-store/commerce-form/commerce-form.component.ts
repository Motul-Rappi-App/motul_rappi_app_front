import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommerceRequestEntitie, CommerceUpdateRequestEntitie, LocationResponseEntitie } from '../../../../core/models';
import { LocationsService } from '../../../services/locations.service';

@Component({
  selector: 'app-commerce-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-form.component.html',
  styleUrl: './commerce-form.component.css'
})
export class CommerceFormComponent {

  @Input() locationsList: LocationResponseEntitie[] = [];
  @Input() selectedCommerce: CommerceUpdateRequestEntitie | null = null;
  @Output() addCommerce = new EventEmitter<CommerceRequestEntitie>();
  @Output() updateCommerce = new EventEmitter<CommerceUpdateRequestEntitie>();

  commerceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService,
    private locationsService: LocationsService
  ) {
    this.commerceForm = this.fb.group({
      nit: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.pattern(/^[0-9]{9,12}$/)  // NIT_REGEX
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/)  // PASSWORD_REGEX
        ]
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])[A-Za-zÁÉÍÓÚáéíóú0-9]{1,50}$/)  // NAME_REGEX
        ]
      ],
      locationId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  ngOnChanges(): void {
    if (this.selectedCommerce) {
      this.commerceForm.patchValue(this.selectedCommerce);
      // Deshabilita el campo de correo si se está editando
      this.commerceForm.get('email')?.disable();
    } else {
      this.commerceForm.reset();
      // Habilita el campo de correo si se está añadiendo un nuevo comercio
      this.commerceForm.get('email')?.enable();
    }
  }


  loadLocations(): void {
    this.locationsService.getLocations().subscribe(data => {
      this.locationsList = data;
    });
  }

  onSubmit(): void {
    if (this.commerceForm.valid) {
      const commerceData = this.commerceForm.value;
      if (this.selectedCommerce) {
        // Updating an existing commerce
        this.updateCommerce.emit({ ...this.selectedCommerce, ...commerceData });
        this._toast.success('Comercio actualizado', 'Éxito');
      } else {
        // Adding a new commerce
        const newCommerce: CommerceRequestEntitie = {
          ...commerceData,
          adminId: 1  // Valor quemado según requerimiento
        };
        this.addCommerce.emit(newCommerce);
        this._toast.success('Comercio añadido', 'Éxito');
      }
      this.commerceForm.reset();
    } else {
      this._toast.error('Formulario inválido', 'Error');
    }
  }

}
