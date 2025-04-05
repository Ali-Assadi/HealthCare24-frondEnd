import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-better-sleep-3',
  imports: [RouterLink],
  templateUrl: './better-sleep-3.component.html',
  styleUrl: './better-sleep-3.component.css'
})
export class BetterSleep3Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
