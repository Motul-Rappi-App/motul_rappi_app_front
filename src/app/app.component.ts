import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrincipalLayoutComponent } from './layouts/principal-layout/principal-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrincipalLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'promorappimotul';
}
