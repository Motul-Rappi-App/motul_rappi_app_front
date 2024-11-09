import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Commerce } from '../../../models/commerce.model';
import { City } from '../../../models/city.model';
import { CitiesService } from '../../../services/cities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commerce-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-form.component.html',
  styleUrl: './commerce-form.component.css'
})
export class CommerceFormComponent {

  @Input() selectedCommerce: Commerce | null = null;
  @Output() addCommerce = new EventEmitter<Commerce>();
  @Output() updateCommerce = new EventEmitter<Commerce>();

  commerceForm: FormGroup;
  citiesList: City[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private citiesService: CitiesService
  ) {
    this.commerceForm = this.fb.group({
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
      cities: [[], Validators.required],
      nit: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')
        ]
      ],
    });
  }

  ngOnInit(): void {
    this.citiesService.cities$.subscribe(data => {
      this.citiesList = data;
    });
  }

  filteredCities(): City[] {
    return this.citiesList.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCommerce'] && this.selectedCommerce) {
      this.setFormValues(this.selectedCommerce);
    }
  }

  private setFormValues(commerce: Commerce): void {
    this.commerceForm.patchValue({
      name: commerce.name,
      cities: commerce.idCity,
      nit: commerce.nit,
      email: commerce.email,
      password: commerce.password,
      date: commerce.date
    });
  }

  private resetForm(): void {
    this.commerceForm.reset();
    this.selectedCommerce = null;
  }

  onSubmit(): void {
    if (this.commerceForm.valid) {
      const commerceData: Commerce = {
        id: Math.random().toString(36).substring(2),
        name: this.commerceForm.value.name,
        idCity: this.commerceForm.value.cities,
        nit: this.commerceForm.value.nit,
        email: this.commerceForm.value.email,
        password: this.commerceForm.value.password,
        date: this.selectedCommerce ? this.selectedCommerce.date : new Date().toISOString().split('T')[0],
        idAdmin: '1'
      };

      if (this.selectedCommerce) {
        this.updateCommerce.emit(commerceData);
      } else {
        this.addCommerce.emit(commerceData);
      }

      this.resetForm();
    }
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
    return this.commerceForm.get('name');
  }

  get formTitle(): string {
    return this.selectedCommerce ? 'Editar Comercio' : 'Añadir Comercio';
  }

  get submitButtonText(): string {
    return this.selectedCommerce ? 'Actualizar Comercio' : 'Añadir Comercio';
  }
}