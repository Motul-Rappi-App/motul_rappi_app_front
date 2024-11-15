import { Component, OnInit } from '@angular/core';
import { OilsListComponent } from "./oils-list/oils-list.component";
import { ViscositiesListComponent } from "./viscosities-list/viscosities-list.component";
import { OilsLocalService } from '../../services/oils-local.service';
import { OilFormComponent } from './oil-form/oil-form.component';
import { ViscositiesFormComponent } from './viscosities-form/viscosities-form.component';
import {  OilReferenceResponseEntity, ViscosityResponseEntity } from '../../../core/models';
import { OilReferenceUpdateRequestEntity } from '../../../core/models/oilReference/OilReferenceUpdateRequest.entity';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-section-products',
  standalone: true,
  imports: [OilsListComponent, OilFormComponent, ViscositiesListComponent, ViscositiesFormComponent],
  templateUrl: './section-products.component.html',
  styleUrl: './section-products.component.css'
})
export class SectionProductsComponent{

  oilsList: OilReferenceResponseEntity[] = [];
  viscositiesList: ViscosityResponseEntity[] = [];
  selectedOil: OilReferenceResponseEntity | null = null;

  constructor(
    private oilsLocalService: OilsLocalService,
  ) { }



  onEditOil(oil: OilReferenceResponseEntity): void {
    this.selectedOil = oil;
  }

  onUpdateOil(updateOil: OilReferenceUpdateRequestEntity): void {
    this.selectedOil = null;
  }

  onDeleteOil(id: number): void {
    const userConfirmed = window.confirm('¿Estás seguro de que deseas eliminar el aceite? Esta acción no se puede deshacer y eliminará todas las transacciones relacionadas a esa referencia de aceite');
    if(userConfirmed) this.oilsLocalService.onDeleteOil(id);
    this.selectedOil = null;
  }
}