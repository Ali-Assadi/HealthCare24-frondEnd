import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-healthy-recipes3',
  imports: [RouterLink],
  templateUrl: './healthy-recipes3.component.html',
  styleUrl: './healthy-recipes3.component.css'
})
export class HEALTHYRECIPES3Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
