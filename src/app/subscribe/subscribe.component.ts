import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})
export class SubscribeComponent {
  email: string = '';

  constructor(private http: HttpClient) {}

  subscribe() {
    if (!this.email) {
      alert('Please enter a valid email');
      return;
    }

    this.http.post('http://localhost:3000/api/subscribe', { email: this.email })
      .subscribe({
        next: () => alert('🎉 Subscription successful! Check your email.'),
        error: () => alert('❌ Failed to send email. Try again.')
      });
  }
}
