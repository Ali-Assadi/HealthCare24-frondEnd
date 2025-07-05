import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cardio-fitness4',
  imports: [RouterLink],
  templateUrl: './cardio-fitness4.component.html',
  styleUrl: './cardio-fitness4.component.css'
})
export class CARDIOFITNESS4Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
