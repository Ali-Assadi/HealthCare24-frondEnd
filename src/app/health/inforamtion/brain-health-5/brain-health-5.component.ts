import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brain-health-5',
  imports: [RouterLink],
  templateUrl: './brain-health-5.component.html',
  styleUrl: './brain-health-5.component.css'
})
export class BrainHealth5Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
