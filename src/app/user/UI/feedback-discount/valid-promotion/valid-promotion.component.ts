import { Component, Input, OnInit } from '@angular/core';
import { SelectProductComponent } from "./select-product/select-product.component";

@Component({
  selector: 'app-valid-promotion',
  standalone: true,
  imports: [SelectProductComponent],
  templateUrl: './valid-promotion.component.html',
  styleUrls: ['./valid-promotion.component.css'],
})
export class ValidPromotionComponent implements OnInit {

  @Input() message: string = '';
  @Input() cedula: string | undefined;

  constructor() { }

  ngOnInit() {
  }

}
