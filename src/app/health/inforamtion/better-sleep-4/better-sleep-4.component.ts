import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-better-sleep-4',
  imports: [RouterLink],
  templateUrl: './better-sleep-4.component.html',
  styleUrl: './better-sleep-4.component.css'
})
export class BetterSleep4Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
