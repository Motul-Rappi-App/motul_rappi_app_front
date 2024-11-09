import { Component, OnInit } from '@angular/core';
import { OilsListComponent } from "./oils-list/oils-list.component";
import { ViscositiesListComponent } from "./viscosities-list/viscosities-list.component";
import { Oil } from '../../models/oil.model';
import { Viscosity } from '../../models/viscosity.model';
import { OilsService } from '../../services/oils.service';
import { ViscositiesService } from '../../services/viscosities.service';
import { OilFormComponent } from './oil-form/oil-form.component';
import { ViscositiesFormComponent } from './viscosities-form/viscosities-form.component';

@Component({
  selector: 'app-section-products',
  standalone: true,
  imports: [OilsListComponent, OilFormComponent, ViscositiesListComponent, ViscositiesFormComponent],
  templateUrl: './section-products.component.html',
  styleUrl: './section-products.component.css'
})
export class SectionProductsComponent implements OnInit {

  oilsList: Oil[] = [];
  viscositiesList: Viscosity[] = [];
  selectedOil: Oil | null = null;

  constructor(
    private oilsService: OilsService,
    private viscositiesService: ViscositiesService
  ) { }

  ngOnInit(): void {

    this.oilsService.oils$.subscribe(data => {
      this.oilsList = data;
    })

    this.viscositiesService.loadViscositiesFromDb();
  }

  onAddOil(newOil: Oil): void {
    this.oilsService.addOil(newOil);
  }

  onEditOil(oil: Oil): void {
    this.selectedOil = oil;
  }

  onUpdateOil(updatedOil: Oil): void {
    this.oilsService.updateOil(updatedOil.id, updatedOil);
    this.selectedOil = null;
  }

  onDeleteOil(id: string): void {
    this.oilsService.deleteOil(id);
  }

  onAddViscosity(newViscosity: Viscosity): void {
    this.viscositiesService.addViscosity(newViscosity).subscribe();
  }
}
