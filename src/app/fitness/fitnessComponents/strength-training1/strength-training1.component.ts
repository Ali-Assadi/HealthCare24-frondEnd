import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-strength-training1',
  imports: [RouterLink],
  templateUrl: './strength-training1.component.html',
  styleUrl: './strength-training1.component.css'
})
export class STRENGTHTRAINING1Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
