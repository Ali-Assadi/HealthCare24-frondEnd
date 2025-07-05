import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-healthy-meals',
  imports: [RouterLink],
  templateUrl: './healthy-meals.component.html',
  styleUrl: './healthy-meals.component.css'
})
export class HEALTHYMEALSComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
