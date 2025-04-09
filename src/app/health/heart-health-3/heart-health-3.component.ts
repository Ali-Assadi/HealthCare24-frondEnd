import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-heart-health-3',
  imports: [RouterLink],
  templateUrl: './heart-health-3.component.html',
  styleUrl: './heart-health-3.component.css'
})
export class HeartHealth3Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
