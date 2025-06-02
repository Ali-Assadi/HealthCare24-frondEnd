import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [FormsModule , RouterLink],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css',
})
export class SubscribeComponent implements OnInit {
  email: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('userEmail') || '';
  }

  subscribe() {
    if (!this.email) {
      alert('You must be logged in to subscribe.');
      return;
    }

    this.http
      .post('http://localhost:3000/api/subscribe', { email: this.email })
      .subscribe({
        next: () => alert('🎉 Subscription successful! Check your email.'),
        error: () => alert('❌ Failed to send email. Try again.'),
      });
  }
}
