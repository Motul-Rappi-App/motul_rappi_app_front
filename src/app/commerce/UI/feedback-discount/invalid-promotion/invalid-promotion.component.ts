import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invalid-promotion',
  standalone: true,
  templateUrl: './invalid-promotion.component.html',
  styleUrls: ['./invalid-promotion.component.css']
})
export class InvalidPromotionComponent {

  @Input() message: string = '';
  @Input() cedula: string | undefined;

  constructor(
    private router: Router
  ) { }

  public goToRedeem() {
    console.log('Redirigiendo a la página de redención');
    this.router.navigate(['/commerce/lobby']);
  }

}
