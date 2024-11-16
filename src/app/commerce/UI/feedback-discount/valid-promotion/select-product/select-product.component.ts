import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";
import { OilReferenceResponseEntity, ViscosityResponseEntity } from "../../../../../core/models";
import { Observable } from "rxjs";
import { OilReferenceService } from '../../../../../core/services/oil-reference.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-select-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent implements OnInit {

  viscosities: ViscosityResponseEntity[] | null = null;
  products: OilReferenceResponseEntity[] | null = null;

  productForm: FormGroup;
  isLoading: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService,
    private oilReferenceServ: OilReferenceService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      referencia: ['', Validators.required],
      viscosidad: ['', Validators.required],
      litros: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.viscosities = [];
    this.getOilReferences()
  }

  onReferenciaChange() {
    const selectedReferenceId = this.productForm.get('referencia')?.value;
    const reference = this.products?.filter(product => product.id === parseInt(selectedReferenceId));
    if(!reference) return

    reference.length == 1 ? this.viscosities = reference[0].viscosities : this.viscosities = [];
    if(this.viscosities.length == 0) {
      this.productForm.get('viscosidad')?.setValue('EMPTY');
      return
    }
    

    this.productForm.get('viscosidad')?.setValue('');
  }

  onSubmit() {
    this.isLoading = true;
    if (this.productForm.valid) {
      this.isLoading = false;
      this._toast.success('Formulario enviado con éxito', 'Producto Seleccionado');

      console.log('Formulario válido:', this.productForm.value);
    } else {
      this.isLoading = false;
      this._toast.error('Formulario inválido', 'Error al enviar');
    }
  }

  getOilReferences(){
    this.oilReferenceServ.getAllOilReferences()?.subscribe({
      next: (response: OilReferenceResponseEntity[]) => {
        if(response) this.products = response;
      },
      error: (error) => {
        this._toast.error('Error al obtener las referencias de aceite', 'Error interno');
        this.router.navigate(['/commerce/reedem'])
      }
    })
  }

  get referencia() { return this.productForm.get('referencia'); }
  get viscosidad() { return this.productForm.get('viscosidad'); }
  get litros() { return this.productForm.get('litros'); }
}
