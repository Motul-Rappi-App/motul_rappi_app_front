import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { ValidatePromotionResponseEntity } from '../../../core/models';
import { ValidPromotionComponent } from "./valid-promotion/valid-promotion.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback-discount',
  standalone: true,
  imports: [CommonModule, FormsModule, ValidPromotionComponent],
  templateUrl: './feedback-discount.component.html',
  styleUrls: ['./feedback-discount.component.css']
})
export class FeedbackDiscountComponent implements OnInit{

  promotionInformation: ValidatePromotionResponseEntity | null = null;
  constructor( private router: Router) { }

  ngOnInit(): void {
    this.promotionInformation = history.state;
    if(!this.promotionInformation) this.router.navigate(['/commerce/reedem']);

    window.addEventListener('popstate', () => {
      history.pushState(null, '', window.location.href);
    });
  }

  ngOnDestroy(): void {
    this.promotionInformation = null;
    window.removeEventListener('popstate', () => {})
  }
}
