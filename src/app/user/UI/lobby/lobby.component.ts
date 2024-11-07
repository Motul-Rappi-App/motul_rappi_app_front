import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  constructor(
    private router: Router,
  ) {}

  goToRedeem() {
    console.log('Sección Redimir');  
    this.router.navigate(['/sellers/reedem']);
  }

  goToRegister() {
    console.log('Sección Inscribir');  
    this.router.navigate(['/sellers/registerrt']);
  }
}
