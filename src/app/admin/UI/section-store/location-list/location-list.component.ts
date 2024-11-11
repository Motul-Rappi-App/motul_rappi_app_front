import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocationResponseEntitie } from '../../../../core/models';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.css'
})
export class LocationListComponent {

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
