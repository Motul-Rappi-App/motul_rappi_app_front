import { Component, OnInit } from '@angular/core';
import { OilsListComponent } from "./oils-list/oils-list.component";
import { ViscositiesListComponent } from "./viscosities-list/viscosities-list.component";
import { OilsService } from '../../services/oils.service';
import { ViscositiesService } from '../../services/viscosities.service';
import { OilFormComponent } from './oil-form/oil-form.component';
import { ViscositiesFormComponent } from './viscosities-form/viscosities-form.component';
import { OilReferenceRequestEntitie, OilReferenceResponseEntitie, ViscosityRequestEntitie, ViscosityResponseEntitie } from '../../../core/models';
import { OilReferenceUpdateRequestEntitie } from '../../../core/models/oilReference/OilReferenceUpdateRequest.entitie';

@Component({
  selector: 'app-section-products',
  standalone: true,
  imports: [OilsListComponent, OilFormComponent, ViscositiesListComponent, ViscositiesFormComponent],
  templateUrl: './section-products.component.html',
  styleUrl: './section-products.component.css'
})
export class SectionProductsComponent implements OnInit {

  oilsList: OilReferenceResponseEntitie[] = [];
  viscositiesList: ViscosityResponseEntitie[] = [];
  selectedOil: OilReferenceResponseEntitie | null = null;

  constructor(
    private oilsService: OilsService,
    private viscositiesService: ViscositiesService
  ) { }

  ngOnInit(): void {

    this.oilsService.getOils().subscribe(data => {
      this.oilsList = data;
    });

    this.viscositiesService.getViscosities().subscribe(data => {
      this.viscositiesList = data;
    });
  }

  onAddOil(newOil: OilReferenceRequestEntitie): void {
    this.oilsService.addOil(newOil).subscribe(() => {
      this.oilsService.getOils().subscribe(data => {
        this.oilsList = data;
      });
    });
  }

  onEditOil(oil: OilReferenceUpdateRequestEntitie): void {
    this.selectedOil = {
      ...this.selectedOil,
      ...oil
    } as unknown as OilReferenceResponseEntitie;
  }

  onUpdateOil(updateOil: OilReferenceUpdateRequestEntitie): void {
    this.oilsService.updateOil(updateOil).subscribe(() => {
      this.oilsService.getOils().subscribe(data => {
        this.oilsList = data;
      });
      this.selectedOil = null;
    });
  }

  onDeleteOil(id: number): void {
    this.oilsService.deleteOil(id).subscribe(() => {
      this.oilsService.getOils().subscribe(data => {
        this.oilsList = data;
      });
    });
  }

  onAddViscosity(newViscosity: ViscosityRequestEntitie): void { 
    this.viscositiesService.addViscosity(newViscosity).subscribe(data => {
      this.viscositiesList.push(data);
    });
  }
}
