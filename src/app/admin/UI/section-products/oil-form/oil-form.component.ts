import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ViscositiesLocalService } from '../../../services/viscosities-local.service';
import { CommonModule } from '@angular/common';
import { OilReferenceRequestEntity, OilReferenceResponseEntity, ViscosityRequestEntity, ViscosityResponseEntity } from '../../../../core/models';
import { ToastrService } from 'ngx-toastr';
import { OilReferenceUpdateRequestEntity } from '../../../../core/models/oilReference/OilReferenceUpdateRequest.entity';
import { environment } from '../../../../../environments/environment.development';
import { OilsLocalService } from '../../../services/oils-local.service';
import { OilReferencesMapperService } from '../../../../core/helpers/mappers/oil-references-mapper.service';

@Component({
  selector: 'app-oil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './oil-form.component.html',
  styleUrls: ['./oil-form.component.css']
})
export class OilFormComponent {

  @Input() selectedOil: OilReferenceResponseEntity | null = null;
  viscositiesList: ViscosityResponseEntity[] = [];
  @Output() updateOil = new EventEmitter<OilReferenceUpdateRequestEntity>();

  oilForm: FormGroup;
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private viscositiesLocalServ: ViscositiesLocalService,
    private oilReferenceMapper: OilReferencesMapperService,
    private oilsLocalServ: OilsLocalService,
    private _toastServ: ToastrService,
  ) {
    this.oilForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚ0-9 ]+$'), 
          this.oilsLocalServ.noWhitespaceValidator,
          this.oilsLocalServ.noConsecutiveCharactersValidator,
          this.oilsLocalServ.noOnlyNumbersValidator,
        ]
      ],
      viscosities: [[], Validators.required],
      adminId: [null]
    });
  }

  ngOnInit(): void {
    this.watchUpdatesInViscosityLocal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOil'] && this.selectedOil) this.setFormValuesToUpdate(this.selectedOil);
  }

  private setFormValuesToUpdate(oilReferenceSelected: OilReferenceResponseEntity): void{

    const oilReferenceToUpd = this.oilReferenceMapper.oilReferenceFromObjectToUpdate(this.selectedOil!.id, oilReferenceSelected); 
    if(oilReferenceToUpd) this.oilForm.patchValue(oilReferenceToUpd);
  }

  async onSubmit(){

    if(!this.isValidForm()) return;

    if (this.selectedOil) this.oilsLocalServ.updateOilReferenceInDb(this.selectedOil.id, this.oilForm.value);
    else await this.createOilRef()

    this.resetForm()
    this.updateOil.emit();
  }

  async createOilRef(){
    const oilReferenceData = this.oilReferenceMapper.oilReferenceFromFormToRequest(this.oilForm);
    if(oilReferenceData) await this.oilsLocalServ.saveOilReferenceInDbAndLocal(oilReferenceData);
  }
  
  private isValidForm(): boolean {

    if(this.oilForm.invalid){
      this._toastServ.error('Por favor complete el formulario', 'Error en formulario');
      return false;
    }
    return true
  }
  
  private resetForm(): void {
    this.oilForm.reset();
    this.selectedOil = null;
  }

  get name() { return this.oilForm.get('name') }

  get formTitle(): string { return this.selectedOil ? 'Editar Aceite' : 'Añadir Aceite' }

  get submitButtonText(): string { return this.selectedOil ? 'Atualizar Aceite' : 'Añadir Aceite' }

  watchUpdatesInViscosityLocal(){
    this.viscositiesLocalServ.viscositiesLocalList$.subscribe((viscosities: ViscosityResponseEntity[]) => this.viscositiesList = viscosities);
  }

  filteredViscosities(): ViscosityResponseEntity[] {
    return this.viscositiesList.filter(viscosity =>
      viscosity.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isViscositySelected(viscosityId: number): boolean {
    return this.selectedOil?.viscosities?.some(v => v.id === viscosityId) || false;
  }
}
