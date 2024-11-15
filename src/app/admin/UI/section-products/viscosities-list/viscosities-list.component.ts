import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ViscosityResponseEntity } from '../../../../core/models';
import { ViscositiesLocalService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { OilReferenceService } from '../../../../core/services';

@Component({
  selector: 'app-viscosities-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viscosities-list.component.html',
  styleUrl: './viscosities-list.component.css',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class ViscositiesListComponent implements OnInit{

  constructor(private viscositiesLocalServ: ViscositiesLocalService,
              private _toastServ: ToastrService,
              private oilReferenceServ: OilReferenceService
  ){}

  viscositiesList: ViscosityResponseEntity[] = [];
  searchTerm: string = '';
  
  ngOnInit(): void {
    this.updateViscosities();
    this.watchUpdatesInViscosityLocal();
  }

  updateViscosities(): void {
    this.oilReferenceServ.getAllViscosities()?.subscribe({
      next: (locations: ViscosityResponseEntity[]) => this.viscositiesLocalServ.addViscositiesFromDbToLocalList(locations),
      error: (error: any) => this._toastServ.error('Error cargando las Viscosidades', 'Error de carga')});
  }

  watchUpdatesInViscosityLocal(){
    this.viscositiesLocalServ.viscositiesLocalList$.subscribe((viscosities: ViscosityResponseEntity[]) => this.viscositiesList = viscosities);
  }

  getFilteredViscosities() {
    return this.viscositiesList.filter(viscosity => viscosity.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
