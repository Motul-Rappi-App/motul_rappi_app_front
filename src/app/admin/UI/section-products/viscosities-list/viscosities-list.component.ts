import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Viscosity } from '../../../models/viscosity.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ViscosityResponseEntitie } from '../../../../core/models';

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
export class ViscositiesListComponent {
  @Input() viscositiesList: ViscosityResponseEntitie[] = [];
  @Output() addViscosity = new EventEmitter<void>();

  searchTerm: string = '';

  onAddViscosity(): void {
    this.addViscosity.emit();
  }

  getFilteredViscosities(): ViscosityResponseEntitie[] {
    return this.viscositiesList.filter(viscosity =>
      viscosity.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
