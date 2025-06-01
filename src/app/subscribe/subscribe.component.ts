import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css',
})
export class SubscribeComponent implements OnInit {
  email: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.email = localStorage.getItem('userEmail') || '';
    if (!this.email) {
      this.toastr.info('Please log in to subscribe.', 'Login Required');
    }
  }

  subscribe() {
    if (!this.email) {
      this.toastr.warning('You must be logged in to subscribe.', 'Login Required');
      return;
    }

    this.http
      .post('http://localhost:3000/api/subscribe', { email: this.email })
      .subscribe({
        next: () => this.toastr.success('Subscription successful! Check your email.', 'Success'), // Success toast
        error: (err) => {
          console.error('Failed to send email:', err); // Log the actual error
          this.toastr.error('Failed to subscribe. Please try again.', 'Error'); // Error toast
        },
      });
  }
}
