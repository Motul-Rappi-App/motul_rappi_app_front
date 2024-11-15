import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { CommerceLocalService } from '../../../services';
import { CommerceService } from '../../../../core/services';
import { CommerceResponseEntity } from '../../../../core/models';

@Component({
  selector: 'app-commerce-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-list.component.html',
  styleUrl: './commerce-list.component.css'
})
export class CommerceListComponent implements OnInit {

  searchTerm: string = '';
  commerceList: CommerceResponseEntity[] = [];
  @Output() editCommerce = new EventEmitter<CommerceResponseEntity>();
  @Output() deleteCommerce = new EventEmitter<number>();


  constructor(
    private commerceLocalServ: CommerceLocalService,
    private commerceServ: CommerceService,
    private _toastServ: ToastrService
  ) { }

  ngOnInit(): void {

    this.updateCommerces()
    this.watchUpdatesInCommercesLocal()
  }

  updateCommerces(){
    this.commerceServ.getAllCommerces()?.subscribe({
      next: (commerces: CommerceResponseEntity[]) => this.commerceLocalServ.addCommercesToLocalEnvironment(commerces),
      error: (error: any) => this._toastServ.error('Error cargando los comercios' + error.error, 'Error de carga')
    });
  }

   getFilteredCommerces(): CommerceResponseEntity[] {

    if (!this.searchTerm.trim()) return this.commerceList;
    const lowerSearchTerm = this.searchTerm.toLowerCase();
    return this.commerceList.filter(commerce => commerce.name.toLowerCase().includes(lowerSearchTerm) );
  }

  watchUpdatesInCommercesLocal(){
    this.commerceLocalServ.commercesLocalList$.subscribe((commerces: CommerceResponseEntity[]) => this.commerceList = commerces);
  }

  onEdit(commmerce: CommerceResponseEntity): void {
    this.editCommerce.emit(commmerce);
  }

  onDelete(id: number): void {
    this.deleteCommerce.emit(id);
  }
}
