import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommercesMapperService } from '../../../../core/helpers';
import { CommerceLocalService, LocationsLocalService } from '../../../services';
import { CommerceRequestEntity, CommerceResponseEntity, LocationResponseEntity } from '../../../../core/models';
import { LocationService } from '../../../../core/services';


@Component({
  selector: 'app-commerce-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-form.component.html',
  styleUrl: './commerce-form.component.css'
})
export class CommerceFormComponent {

  @Input() selectedCommerce: CommerceResponseEntity | null = null;
  @Output() updateCommerce = new EventEmitter<CommerceRequestEntity>();

  commerceForm: FormGroup;
  citiesList: LocationResponseEntity[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private commerceLocalServ: CommerceLocalService,
    private locationsLocalServ: LocationsLocalService,
    private _toastServ: ToastrService,
    private commerceMapperServ: CommercesMapperService,
    private locationServ: LocationService
  ) {
    this.commerceForm = this.fb.group({
      cities: [[], Validators.required],
      nit: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(5), Validators.maxLength(20)]],
      email: [''],
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
    this.watchCitiesChanges();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCommerce'] && this.selectedCommerce) this.setFormValuesToUpdate(this.selectedCommerce)
  }


  private setFormValuesToUpdate(selectedCommerce: CommerceResponseEntity): void {

    const commerceToUpd = this.commerceMapperServ.commerceFromObjectToUpdate(selectedCommerce.id, selectedCommerce, this.commerceForm.value.password);
    if(commerceToUpd) this.commerceForm.patchValue(commerceToUpd);
  }

  async onSubmit(){

    if(!this.isValidForm()) return;

    if (this.selectedCommerce) this.commerceLocalServ.updateCommerceInDB(this.selectedCommerce.id, this.commerceForm.value, this.commerceForm.value.password);
    else await this.createCommerce()
    this.resetForm();
  }

  async createCommerce(){

    const commerceData = this.commerceMapperServ.commerceFromFormToRequest(this.commerceForm);
    if (commerceData) await this.commerceLocalServ.saveCommerceInDBAndLocal(commerceData);
  }

  private isValidForm(): boolean {
    if(this.commerceForm.invalid){
      this._toastServ.error('Por favor complete el formulario', 'Error en formulario');
      return false;
    }
    return true
  }

    
  private resetForm(): void {
    this.commerceForm.reset();
    this.selectedCommerce = null;
  }


  loadLocations(): void {
    this.locationServ.getAllLocations()?.subscribe(data => {
      this.citiesList = data;
    });
  }

  watchCitiesChanges(){
    this.locationsLocalServ.locationsLocalList$.subscribe((locationsFromLocal:LocationResponseEntity[]) => this.citiesList = locationsFromLocal )
  }

  filteredCities(): LocationResponseEntity[] {
    return this.citiesList.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
