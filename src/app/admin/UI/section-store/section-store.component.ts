import { Component, OnInit } from '@angular/core';
import { CommerceFormComponent } from './commerce-form/commerce-form.component';
import { CommerceListComponent } from './commerce-list/commerce-list.component';
import { Commerce } from '../../models/commerce.model';
import { CommerceService } from '../../services/commerce.service';
import { LocationRequestEntitie, LocationResponseEntitie } from '../../../core/models';
import { LocationsService } from '../../services/locations.service';
import { CityListComponent } from './location-list/city-list.component';
import { CityFormComponent } from './location-form/city-form.component';

@Component({
  selector: 'app-section-store',
  standalone: true,
  imports: [CommerceFormComponent, CommerceListComponent, CityListComponent, CityFormComponent],
  templateUrl: './section-store.component.html',
  styleUrl: './section-store.component.css'
})
export class SectionStoreComponent implements OnInit {

  locationsList: LocationResponseEntitie[] = [];
  commerceList: Commerce[] = [];
  selectedCommerce: Commerce | null = null;

  constructor(
    private locationsService: LocationsService,
    private commerceService: CommerceService
  ) { }

  ngOnInit(): void {
    this.locationsService.getLocations().subscribe(data => {
      this.locationsList = data;
    });

    this.commerceService.commerces$.subscribe(data => {
      this.commerceList = data;
    });
  }

  onAddCommerce(newCommerce: Commerce): void {
    this.commerceService.addCommerce(newCommerce);
  }

  onEditCommerce(commerce: Commerce): void {
    this.selectedCommerce = commerce;
  }

  onUpdateCommerce(updatedCommerce: Commerce): void {
    this.commerceService.updateCommerce(updatedCommerce.id, updatedCommerce);
    this.selectedCommerce = null;
  }

  onDeleteCommerce(id: string): void {
    this.commerceService.deleteCommerce(id);
  }

  onAddLocation(newLocation: LocationRequestEntitie): void {
    this.locationsService.addLocation(newLocation).subscribe(data => {
      this.locationsList.push(data); // Añade la nueva ubicación recibida del backend a la lista
    });
  }

}
