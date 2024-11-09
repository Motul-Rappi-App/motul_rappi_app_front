import { Component, EventEmitter, Input, Output } from '@angular/core';
import { City } from '../../../models/city.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
})
export class CityListComponent {

  @Input() citiesList: City[] = [];
  @Output() addCity = new EventEmitter<void>();

  searchTerm: string = '';

  onAddCity(): void {
    this.addCity.emit();
  }

  getFilteredCities(): City[] {
    return this.citiesList.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


}
