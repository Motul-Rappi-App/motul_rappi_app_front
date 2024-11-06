import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-forms-container',
  standalone: true,
  imports: [],
  templateUrl: './forms-container.component.html',
  styleUrl: './forms-container.component.css'
})
export class FormsContainerComponent {
  @Input() title: string = "";
}
