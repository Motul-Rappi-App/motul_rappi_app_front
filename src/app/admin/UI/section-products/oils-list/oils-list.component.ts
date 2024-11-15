import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { OilReferenceResponseEntity, ViscosityResponseEntity } from '../../../../core/models';
import { OilReferenceUpdateRequestEntity } from '../../../../core/models/oilReference/OilReferenceUpdateRequest.entity';
import { OilsLocalService } from '../../../services';
import { OilReferenceService } from '../../../../core/services/oil-reference.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-oils-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oils-list.component.html',
  styleUrl: './oils-list.component.css',
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
export class OilsListComponent {

  searchTerm: string = '';
  oilsList: OilReferenceResponseEntity[] = [];
  @Output() editOil = new EventEmitter<OilReferenceResponseEntity>();
  @Output() deleteOil = new EventEmitter<number>();

  constructor(private oilsReferenceLocalServ: OilsLocalService,
              private oilReferenceServ: OilReferenceService,
              private _toastServ: ToastrService
  ){}


  ngOnInit(): void {
    this.updateOilReferences()
    this.watchUpdatesInOilReferencesLocal()
  }

  updateOilReferences(){
    this.oilReferenceServ.getAllOilReferences()?.subscribe({
      next: (commerces: OilReferenceResponseEntity[]) => this.oilsReferenceLocalServ.addOilReferencesToLocalEnvironment(commerces),
      error: (error: any) => this._toastServ.error('Error cargando los comercios' + error.error, 'Error de carga')
    });
  }


  getFilteredOils(): OilReferenceResponseEntity[] {
    return this.oilsList.filter(oil =>
      oil.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getViscosityNames(viscosities: ViscosityResponseEntity[]): string {
    return viscosities.map(viscosity => viscosity.description).join(', ');
  }

  watchUpdatesInOilReferencesLocal(){
    this.oilsReferenceLocalServ.oilReferencesLocalList$.subscribe((oils: OilReferenceResponseEntity[]) => this.oilsList = oils);
  }

  onEdit(oil: OilReferenceResponseEntity): void {
    this.editOil.emit(oil);
  }

  onDelete(id: number): void {
    this.deleteOil.emit(id);
  }

}
