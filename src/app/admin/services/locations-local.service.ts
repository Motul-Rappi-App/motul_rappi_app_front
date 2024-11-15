import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocationRequestEntity, LocationResponseEntity } from '../../core/models';
import { LocationService } from '../../core/services';
import { ParseErrorService } from '../../core/helpers';

@Injectable({
  providedIn: 'root'
})
export class LocationsLocalService {

  private locationsLocalListSubject = new BehaviorSubject<LocationResponseEntity[]>([]);
  public locationsLocalList$: Observable<LocationResponseEntity[]> = this.locationsLocalListSubject.asObservable();


  constructor(private locationServ: LocationService,
              private _toastServ: ToastrService,
              private parseErrorServ: ParseErrorService
  ) { }

  addLocationToLocalList(location: LocationResponseEntity): void {
    const currentLocations = this.locationsLocalListSubject.value;
    this.locationsLocalListSubject.next([...currentLocations, location]);
  }

  addLocationsFromDBToLocalList(locations: LocationResponseEntity[]): void {
    this.locationsLocalListSubject.next(locations);
  }


  saveLocationInDb(location:LocationRequestEntity): Promise<LocationResponseEntity> | null{
    return new Promise((resolve, reject) => {

      this.locationServ.createLocation(location)?.subscribe({
        next: (loc) => {

          this._toastServ.success(`Ubicacion: ${loc.name} guardada con exito`, 'Guardado exitoso');
          resolve(loc);
        }, error: (err) => {
          
          this._toastServ.error(this.parseErrorServ.parseErrorFromBackend(err), 'Error guardando ubicacion');
          reject(null);
        }
      })
    })
  }

  addLocationToLocalEnvironment(location: LocationResponseEntity | null){

    if(location) this.addLocationToLocalList(location);
    else  this._toastServ.error('Error guardando ubicacion en lista local', 'Error actualizando informacion');
  }
}
