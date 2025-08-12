import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brain-health-4',
  imports: [RouterLink],
  templateUrl: './brain-health-4.component.html',
  styleUrl: './brain-health-4.component.css'
})
export class BrainHealth4Component {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
