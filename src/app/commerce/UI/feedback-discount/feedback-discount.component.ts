import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvalidPromotionComponent } from './invalid-promotion/invalid-promotion.component';
import { ValidPromotionComponent } from './valid-promotion/valid-promotion.component';

@Component({
  selector: 'app-feedback-discount',
  standalone: true,
  imports: [CommonModule, FormsModule, InvalidPromotionComponent, ValidPromotionComponent],
  templateUrl: './feedback-discount.component.html',
  styleUrls: ['./feedback-discount.component.css']
})
export class FeedbackDiscountComponent implements OnInit {

  @Input() cedula: string | undefined;
  isValid: boolean = false;
  message: string = '';

  constructor() { }

  ngOnInit(): void {
    const { cedula, valid, message } = history.state as { cedula: string, valid: boolean, message: string };

    this.cedula = cedula;
    this.isValid = valid;
    this.message = message;

    console.log(this.cedula, this.isValid, this.message);
  }

  // Función para validar la cédula
  validateCedula(cedula: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(cedula.startsWith('1')); // Validación simulada
      }, 1000); // Simulamos un retraso de 1 segundo
    });
  }

}
