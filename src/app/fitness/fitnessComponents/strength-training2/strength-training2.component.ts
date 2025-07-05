import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-strength-training2',
  imports: [RouterLink],
  templateUrl: './strength-training2.component.html',
  styleUrl: './strength-training2.component.css'
})
export class STRENGTHTRAINING2Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
