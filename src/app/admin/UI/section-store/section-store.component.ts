import { Component, OnInit } from '@angular/core';
import { CommerceRequestEntitie, CommerceResponseEntitie, CommerceUpdateRequestEntitie, LocationRequestEntitie, LocationResponseEntitie } from '../../../core/models';
import { CommerceService } from '../../services/commerce.service';
import { LocationsService } from '../../services/locations.service';
import { CommerceFormComponent } from './commerce-form/commerce-form.component';
import { CommerceListComponent } from './commerce-list/commerce-list.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { LocationListComponent } from './location-list/location-list.component';

@Component({
  selector: 'app-section-store',
  standalone: true,
  imports: [CommerceListComponent, CommerceFormComponent, LocationFormComponent, LocationListComponent],
  templateUrl: './section-store.component.html',
  styleUrl: './section-store.component.css'
})
export class SectionStoreComponent implements OnInit {

  locationsList: LocationResponseEntitie[] = [];
  commerceList: CommerceResponseEntitie[] = [];
  selectedCommerce: CommerceResponseEntitie | null = null;

  constructor(
    private locationsService: LocationsService,
    private commerceService: CommerceService
  ) { }

  ngOnInit(): void {
    this.locationsService.getLocations().subscribe(data => {
      this.locationsList = data;
    });

    this.commerceService.getCommerces().subscribe(data => {
      this.commerceList = data;
    });
  }

  onAddCommerce(newCommerce: CommerceRequestEntitie): void {
    this.commerceService.addCommerce(newCommerce).subscribe(() => {
      this.commerceService.getCommerces().subscribe(data => {
        this.commerceList = data;
      });
    });
  }

  onEditCommerce(commerce: CommerceUpdateRequestEntitie): void {
    this.selectedCommerce = {
      ...this.selectedCommerce,
      ...commerce
    } as CommerceResponseEntitie;
  }

  onUpdateCommerce(updatedCommerce: CommerceUpdateRequestEntitie): void {
    this.commerceService.updateCommerce(updatedCommerce).subscribe(() => {
      this.commerceService.getCommerces().subscribe(data => {
        this.commerceList = data;
      });
      this.selectedCommerce = null;
    });
  }

  onDeleteCommerce(id: number): void {
    this.commerceService.deleteCommerce(id).subscribe(() => {
      this.commerceService.getCommerces().subscribe(data => {
        this.commerceList = data;
      });
    });
  }

  onAddLocation(newLocation: LocationRequestEntitie): void {
    this.locationsService.addLocation(newLocation).subscribe(data => {
      this.locationsList.push(data);
    });
  }

}
