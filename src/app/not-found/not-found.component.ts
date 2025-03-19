import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  template: `
    <div class="not-found" style="height: 711px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  `,
  styles: [
    `
      .not-found {
        text-align: center;
        margin-top: 100px;
      }
      .not-found h1 {
        font-size: 3rem;
        color: #ff4d4f;
      }
      .not-found p {
        font-size: 1.2rem;
      }
    `,
  ],
})
export class NotFoundComponent {

}
