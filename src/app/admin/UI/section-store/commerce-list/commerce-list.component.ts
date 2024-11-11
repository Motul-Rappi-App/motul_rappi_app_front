import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommerceResponseEntitie, LocationResponseEntitie } from '../../../../core/models';

@Component({
  selector: 'app-commerce-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-list.component.html',
  styleUrl: './commerce-list.component.css'
})
export class CommerceListComponent {

  @Input() commerceList: CommerceResponseEntitie[] = [];
  @Output() editCommerce = new EventEmitter<CommerceResponseEntitie>();
  @Output() deleteCommerce = new EventEmitter<number>();

  locationList: LocationResponseEntitie[] = [];

  searchTerm: string = '';


  getFilteredCommerces(): CommerceResponseEntitie[] {

    if (!this.searchTerm.trim()) {
      return this.commerceList;
    }

    const lowerSearchTerm = this.searchTerm.toLowerCase();
    return this.commerceList.filter(commerce =>
      commerce.name.toLowerCase().includes(lowerSearchTerm)
    );
  }

  onEdit(commerce: CommerceResponseEntitie): void {
    this.editCommerce.emit(commerce);
  }

  onDelete(id: number): void {
    this.deleteCommerce.emit(id);
  }
}
