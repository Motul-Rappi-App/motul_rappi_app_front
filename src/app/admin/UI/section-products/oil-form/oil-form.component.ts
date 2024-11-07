import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Oil } from '../../../models/oil.model';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Viscosity } from '../../../models/viscosity.model';
import { ViscositiesService } from '../../../services/viscosities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './oil-form.component.html',
  styleUrls: ['./oil-form.component.css']
})
export class OilFormComponent implements OnInit {

  @Input() selectedOil: Oil | null = null;
  @Output() addOil = new EventEmitter<Oil>();
  @Output() updateOil = new EventEmitter<Oil>();

  currentId: number = 1;
  oilForm: FormGroup;
  viscositiesList: Viscosity[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private viscositiesService: ViscositiesService
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
    this.viscositiesService.viscosities$.subscribe(data => {
      this.viscositiesList = data;
    });
  }

  filteredViscosities(): Viscosity[] {
    return this.viscositiesList.filter(viscosity =>
      viscosity.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOil'] && this.selectedOil) {
      this.setFormValues(this.selectedOil);
    }
  }

  private setFormValues(oil: Oil): void {
    this.oilForm.patchValue({
      name: oil.name,
      viscosities: oil.viscosities
    });
  }

  private resetForm(): void {
    this.oilForm.reset();
    this.selectedOil = null;
  }

  onSubmit(): void {
    if (this.oilForm.valid) {
      const oilData: Oil = {
        id: this.selectedOil ? this.selectedOil.id : this.generateId().toString(),
        name: this.oilForm.value.name,
        viscosities: this.oilForm.value.viscosities,
        idAdmin: '1',
      };

      if (this.selectedOil) {
        this.updateOil.emit(oilData);
      } else {
        this.addOil.emit(oilData);
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

  private generateId(): number {
    return this.currentId++;
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
