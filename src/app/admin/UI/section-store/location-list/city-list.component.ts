import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { LocationsLocalService } from '../../../services';
import { LocationService } from '../../../../core/services';
import { LocationResponseEntity } from '../../../../core/models';


@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
})
export class CityListComponent {

  constructor(private locationsServ: LocationService,
              private _toastServ: ToastrService,
              private locationLocalServ: LocationsLocalService
  ) { }
  
  locationsList: LocationResponseEntity[] = [];

  searchTerm: string = '';

  ngOnInit(): void {
    this.updateLocations();
    this.watchUpdatesInLocationsLocal();
  }

  updateLocations(): void {
    this.locationsServ.getAllLocations()?.subscribe({
      next: (locations: LocationResponseEntity[]) => this.locationLocalServ.addLocationsFromDBToLocalList(locations),
      error: (error: any) => this._toastServ.error('Error cargando las ubicaciones', 'Error de carga')});
  }

  watchUpdatesInLocationsLocal(){
    this.locationLocalServ.locationsLocalList$.subscribe((locations: LocationResponseEntity[]) => this.locationsList = locations);
  }
  
  getFilteredLocations() {
    return this.locationsList.filter(location => location.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
