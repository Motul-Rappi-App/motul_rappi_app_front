import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SelectProductComponent } from './select-product/select-product.component';
import { ValidatePromotionResponseEntity } from '../../../../core/models';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-valid-promotion',
  standalone: true,
  imports: [SelectProductComponent, CommonModule, RouterModule],
  templateUrl: './valid-promotion.component.html',
  styleUrls: ['./valid-promotion.component.css'],
})
export class ValidPromotionComponent{

  @Input() promotionInformation: ValidatePromotionResponseEntity | null = null;
  promotionData : ValidatePromotionResponseEntity | null = null;

  constructor( private router: Router) { }

  ngOnInit(): void {
    if(this.promotionInformation) this.promotionData = this.promotionInformation;
    else this.router.navigate(['/commerce/reedem']);
  }

  ngOnDestroy(): void {
    this.promotionInformation = null;
    this.promotionData = null;
  }

  get promotionTitle(){
    return this.promotionData?.validPromotion ? 'Promoción Valida' : 'Promoción Invalida';
  }

  get isPossibleToCreateRT(){
    return this.promotionData?.doRegisterIn === 'CREATE_RT';
  }

}
