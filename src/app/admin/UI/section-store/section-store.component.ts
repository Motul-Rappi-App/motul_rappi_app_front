import { Component } from '@angular/core';

import { CommerceLocalService } from '../../services';
import { CommerceFormComponent } from './commerce-form/commerce-form.component';
import { CommerceListComponent } from './commerce-list/commerce-list.component';
import {  CommerceResponseEntity, CommerceUpdateRequestEntity, LocationResponseEntity } from '../../../core/models';
import { CityListComponent } from './location-list/city-list.component';
import { CityFormComponent } from './location-form/city-form.component';


@Component({
  selector: 'app-section-store',
  standalone: true,
  imports: [CommerceListComponent, CommerceFormComponent, CityListComponent, CityFormComponent],
  templateUrl: './section-store.component.html',
  styleUrl: './section-store.component.css'
})
export class SectionStoreComponent{

  locationsList: LocationResponseEntity[] = [];
  commerceList: CommerceResponseEntity[] = [];
  selectedCommerce: CommerceResponseEntity | null = null;


  constructor(private commerceLocalServ: CommerceLocalService) { }

  onEditCommerce(commerce: CommerceResponseEntity): void {
    this.selectedCommerce = commerce;
  }

  onUpdateCommerce(updateCommerce: CommerceUpdateRequestEntity): void {
    this.selectedCommerce = null;
  }

  onDeleteCommerce(id: number): void {
    const userConfirmed = window.confirm('¿Estás seguro de que deseas eliminar el comercio? Esta accion no se puede deshacer y eliminara todas las transacciones relacionadas a ese NIT');
    if(userConfirmed) this.commerceLocalServ.onDeleteCommerce(id);
  }
}
