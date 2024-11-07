import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Oil } from '../../../models/oil.model';
import { CommonModule } from '@angular/common';
import { ViscositiesService } from '../../../services/viscosities.service';
import { Viscosity } from '../../../models/viscosity.model';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

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
export class OilsListComponent implements OnInit {

  @Input() oilsList: Oil[] = [];
  @Output() editOil = new EventEmitter<Oil>();
  @Output() deleteOil = new EventEmitter<string>();

  searchTerm: string = '';
  viscositiesMap: { [id: string]: string } = {};

  constructor(private viscositiesService: ViscositiesService) { }

  ngOnInit(): void {
    this.viscositiesService.viscosities$.subscribe((viscosities: Viscosity[]) => {
      this.viscositiesMap = viscosities.reduce((acc, viscosity) => {
        acc[viscosity.id] = viscosity.description;
        return acc;
      }, {} as { [id: string]: string });
    });
  }

  getViscosityNames(oil: Oil): string {
    return oil.viscosities.map(id => this.viscositiesMap[id] || id).join(', ');
  }

  getFilteredOils(): Oil[] {
    return this.oilsList.filter(oil =>
      oil.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onEdit(oil: Oil): void {
    this.editOil.emit(oil);
  }

  onDelete(id: string): void {
      this.deleteOil.emit(id);
  }

}
