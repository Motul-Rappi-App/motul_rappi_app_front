import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby-admin',
  standalone: true,
  imports: [],
  templateUrl: './lobby-admin.component.html',
  styleUrls: ['./lobby-admin.component.css']
})
export class LobbyAdminComponent {

  constructor(
    private router: Router,
  ) {}

  goToComercios() {
    console.log('Sección Comercios');  
    this.router.navigate(['/admin/store']);
  }

  goToProductos() {
    console.log('Sección Productos');
    this.router.navigate(['/admin/products']);
  }

  goToDescargar() {
    console.log('Descargar Información');
    this.router.navigate(['/admin/download']);
  }
}
