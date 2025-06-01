import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  submit() {
    if (!this.email) {
      this.toastr.warning('Please enter your email address.', 'Email Required');
      return;
    }

    this.http.post('http://localhost:3000/api/forgot-password', { email: this.email }).subscribe({
      next: () => {
        this.toastr.success('Temporary password sent to your email!', 'Password Sent'); // Success toast
        this.router.navigate(['/sign-in']); // Redirect after successful password reset request
      },
      error: (err) => {
        console.error('Failed to send password:', err); // Log the actual error
        this.toastr.error('Failed to send password. Please try again.', 'Error'); // Error toast
      }
    });
  }
}
