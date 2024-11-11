import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommerceResponseEntitie, CommerceUpdateRequestEntitie } from '../../../../core/models';

@Component({
  selector: 'app-commerce-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-list.component.html',
  styleUrl: './commerce-list.component.css'
})
export class CommerceListComponent {

  @Input() commerceList: CommerceResponseEntitie[] = [];
  @Output() editCommerce = new EventEmitter<CommerceUpdateRequestEntitie>();
  @Output() deleteCommerce = new EventEmitter<number>();

  searchTerm: string = '';

  getFilteredCommerces(): CommerceResponseEntitie[] {
    return this.commerceList.filter(commerce =>
      commerce.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onEdit(commerce: CommerceResponseEntitie): void {
    if (commerce.location && commerce.location.id) {
      const commerceUpdateRequest: CommerceUpdateRequestEntitie = {
        id: commerce.id,
        nit: commerce.nit,
        email: commerce.email,
        password: commerce.password,
        name: commerce.name,
        locationId: commerce.location.id,
      };
      this.editCommerce.emit(commerceUpdateRequest);
      
    } else {
      console.error("El location o location.id es undefined");
    }
  }
  
  onDelete(id: number): void {
    this.deleteCommerce.emit(id);
  }

}
