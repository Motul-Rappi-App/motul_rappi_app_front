import { Component, OnInit } from '@angular/core';
import { CityFormComponent } from './city-form/city-form.component';
import { CityListComponent } from './city-list/city-list.component';
import { CommerceFormComponent } from './commerce-form/commerce-form.component';
import { CommerceListComponent } from './commerce-list/commerce-list.component';
import { City } from '../../models/city.model';
import { CitiesService } from '../../services/cities.service';
import { Commerce } from '../../models/commerce.model';
import { CommerceService } from '../../services/commerce.service';

@Component({
  selector: 'app-section-store',
  standalone: true,
  imports: [CityFormComponent, CityListComponent, CommerceFormComponent, CommerceListComponent],
  templateUrl: './section-store.component.html',
  styleUrl: './section-store.component.css'
})
export class SectionStoreComponent implements OnInit {

  citiesList: City[] = [];
  commerceList: Commerce[] = [];
  selectedCommerce: Commerce | null = null;

  constructor(
    private citiesService: CitiesService,
    private commerceService: CommerceService
  ) { }

  ngOnInit(): void {
    this.citiesService.cities$.subscribe(data => {
      this.citiesList = data;
    })

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

  onAddCity(newCity: City): void {
    this.citiesService.addCity(newCity).subscribe();
  }

}
