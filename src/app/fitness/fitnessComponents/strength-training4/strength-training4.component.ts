import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-strength-training4',
  imports: [RouterLink],
  templateUrl: './strength-training4.component.html',
  styleUrl: './strength-training4.component.css'
})
export class STRENGTHTRAINING4Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
