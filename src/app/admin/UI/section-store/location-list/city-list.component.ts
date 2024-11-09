import { Component, EventEmitter, Input, Output } from '@angular/core';
import { City } from '../../../models/city.model';
import { CommonModule } from '@angular/common';
import { LocationResponseEntitie } from '../../../../core/models';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
})
export class CityListComponent {

  @Input() locationsList: LocationResponseEntitie[] = [];
  @Output() addLocation = new EventEmitter<void>();

  searchTerm: string = '';

  onAddLocation(): void {
    this.addLocation.emit();
  }

  getFilteredLocations(): LocationResponseEntitie[] {
    return this.locationsList.filter(location =>
      location.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
