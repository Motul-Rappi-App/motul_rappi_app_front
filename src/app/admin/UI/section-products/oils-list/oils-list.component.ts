import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { OilReferenceRequestEntitie, OilReferenceResponseEntitie, ViscosityResponseEntitie } from '../../../../core/models';
import { OilReferenceUpdateRequestEntitie } from '../../../../core/models/oilReference/OilReferenceUpdateRequest.entitie';

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

  @Input() oilsList: OilReferenceResponseEntitie[] = [];
  @Output() addOil = new EventEmitter<void>();
  @Output() editOil = new EventEmitter<OilReferenceUpdateRequestEntitie>();
  @Output() deleteOil = new EventEmitter<number>();

  searchTerm: string = '';
  viscositiesMap: { [id: string]: string } = {};

  getFilteredOils(): OilReferenceResponseEntitie[] {
    return this.oilsList.filter(oil =>
      oil.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getViscosityNames(viscosities: ViscosityResponseEntitie[]): string {
    return viscosities.map(viscosity => viscosity.description).join(', ');
  }


  onEdit(oil: OilReferenceResponseEntitie): void {
    if (oil.viscosities) {
      const oilUpdateRequest: OilReferenceUpdateRequestEntitie = {
        id: oil.id,
        name: oil.name,
        viscosities: oil.viscosities.map(viscosity => viscosity.id),
      };
      this.editOil.emit(oilUpdateRequest);
      
    } else {
      console.error("La viscosidad no existe!");
    }
  }

  onAddOil(): void {
    this.addOil.emit();
  }

  onDelete(id: number): void {
    this.deleteOil.emit(id);
  }

}
