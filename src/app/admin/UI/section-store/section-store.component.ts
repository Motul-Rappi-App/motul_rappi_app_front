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
  selectedCommerce: CommerceResponseEntitie | CommerceUpdateRequestEntitie | null = null;

  constructor(
    private locationsService: LocationsService,
    private commerceService: CommerceService
  ) { }

  ngOnInit(): void {
    this.loadLocations()
    this.loadCommerces();
  }

  loadLocations(): void {
    this.locationsService.getLocations().subscribe(data => {
      this.locationsList = data;
    });
  }

  loadCommerces(): void {
    this.commerceService.getCommerces().subscribe((commerces: CommerceResponseEntitie[]) => {
      // Convertimos `location` a `locationId` en cada comercio
      this.commerceList = commerces.map((commerce: any) => ({
        ...commerce,
        locationId: commerce.location ? commerce.location.id : null, // Extrae solo el ID de `location`
        locationName: commerce.location ? commerce.location.name : null // Extrae solo el nombre de `location`
      }));
      
    });
  }

  onAddCommerce(newCommerce: CommerceRequestEntitie): void {
    this.commerceService.addCommerce(newCommerce).subscribe(data => {
      this.commerceList = [...this.commerceList, data];
      this.loadCommerces();
      this.loadLocations();
    })
  }

  onEditCommerce(commerce: CommerceResponseEntitie): void {
    if ((commerce as any).location && (commerce as any).location.id) {
      this.selectedCommerce = {
        id: commerce.id,
        nit: commerce.nit,
        email: commerce.email,
        password: commerce.password,
        name: commerce.name,
        locationId: (commerce as any).location.id // Extracción directa desde location
      } as CommerceUpdateRequestEntitie;
    } else {
      console.error("Error: 'location' o 'location.id' no está definido en el objeto 'commerce'", commerce);
    }
  }



  onUpdateCommerce(updatedCommerce: CommerceUpdateRequestEntitie): void {
    this.commerceService.updateCommerce(updatedCommerce).subscribe(() => {
      this.loadCommerces();
      this.loadLocations();
      this.selectedCommerce = null;
    });
  }

  onDeleteCommerce(id: number): void {
    this.commerceService.deleteCommerce(id).subscribe(() => {
      this.loadCommerces();
    });
  }

  onAddLocation(newLocation: LocationRequestEntitie): void {
    this.locationsService.addLocation(newLocation).subscribe(data => {
      this.locationsList.push(data);
    });
  }

  onLocationAdded(): void {
    this.loadLocations();
  }

  get selectedCommerceForForm(): CommerceUpdateRequestEntitie | null {
    if (this.selectedCommerce && 'locationId' in this.selectedCommerce && typeof this.selectedCommerce.locationId === 'object') {
      // Convert CommerceResponseEntitie to CommerceUpdateRequestEntitie
      return {
        id: this.selectedCommerce.id,
        nit: this.selectedCommerce.nit,
        email: this.selectedCommerce.email,
        password: this.selectedCommerce.password,
        name: this.selectedCommerce.name,
        locationId: this.selectedCommerce.locationId.id // Use only the ID for location
      };
    }
    return this.selectedCommerce as CommerceUpdateRequestEntitie | null;
  }
}
