import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-select-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent implements OnInit {

  productForm: FormGroup;
  isLoading: boolean = false;

  // Simulación de datos
  products = [
    {id: "2", name: "40200S", viscosities: ["15yr789dg94", "o0jkzkty5x", "f65k34f1xq"], idAdmin: "1"},
    {id: "3", name: "40201S", viscosities: ["xhh80bqneij", "o0jkzkty5x", "1j5nzfod7we"], idAdmin: "1"},
  ];

  allViscosities = [
    {"id":"xhh80bqneij","description":"fewfe","idAdmin":"1"},
    {"id":"15yr789dg94","description":"Vs2","idAdmin":"1"},
    {"id":"o0jkzkty5x","description":"Vs3","idAdmin":"1"},
    {"id":"f65k34f1xq","description":"Vs4","idAdmin":"1"},
    {"id":"1j5nzfod7we","description":"Vs5","idAdmin":"1"}
  ];

  viscosities: { id: string; description: string; idAdmin: string; }[] = [];

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService
  ) {
    this.productForm = this.fb.group({
      referencia: ['', Validators.required],
      viscosidad: ['', Validators.required],
      litros: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.viscosities = [];
  }

  // Método para actualizar las viscosidades según la referencia seleccionada
  onReferenciaChange() {
    const selectedReferenceId = this.productForm.get('referencia')?.value;
    const reference = this.products.find(product => product.id === selectedReferenceId);

    if (reference) {
      this.viscosities = this.allViscosities.filter(viscosity => reference.viscosities.includes(viscosity.id));
    } else {
      this.viscosities = [];
    }
    this.productForm.get('viscosidad')?.setValue('');
  }

  onSubmit() {
    this.isLoading = true;
    if (this.productForm.valid) {
      this.isLoading = false;
      this._toast.success('Formulario enviado con éxito', 'Producto Seleccionado', { 
        timeOut: 3000,
        progressBar: true,
      });

      console.log('Formulario válido:', this.productForm.value);
    } else {
      this.isLoading = false;
      this._toast.error('Formulario inválido', 'Error al enviar', {
        timeOut: 3000,
        progressBar: true,
      });
    }
  }

  get referencia() { return this.productForm.get('referencia'); }
  get viscosidad() { return this.productForm.get('viscosidad'); }
  get litros() { return this.productForm.get('litros'); }
}
