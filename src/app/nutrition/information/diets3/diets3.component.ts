import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-diets3',
  imports: [RouterLink],
  templateUrl: './diets3.component.html',
  styleUrl: './diets3.component.css'
})
export class DIETS3Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
