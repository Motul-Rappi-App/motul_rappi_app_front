import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Commerce } from '../../../models/commerce.model';
import { CitiesService } from '../../../services/cities.service';
import { City } from '../../../models/city.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-commerce-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './commerce-list.component.html',
  styleUrl: './commerce-list.component.css'
})
export class CommerceListComponent implements OnInit {

  @Input() commerceList: Commerce[] = [];
  @Output() editCommerce = new EventEmitter<Commerce>();
  @Output() deleteCommerce = new EventEmitter<string>();

  searchTerm: string = '';
  citiesMap: { [id: string]: string } = {};

  constructor(
    private citiesService: CitiesService,
  ) { }

  ngOnInit(): void {
    this.citiesService.cities$.subscribe((cities: City[]) => {
      this.citiesMap = cities.reduce((acc, city) => {
        acc[city.id] = city.name;
        return acc;
      }, {} as { [id: string]: string });
    });
  }

  getFilteredCommerces(): Commerce[] {
    return this.commerceList.filter(commerce =>
      commerce.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onEdit(commmerce: Commerce): void {
    this.editCommerce.emit(commmerce);
  }

  onDelete(id: string): void {
    this.deleteCommerce.emit(id);
  }
}
