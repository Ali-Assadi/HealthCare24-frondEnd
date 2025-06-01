import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent implements OnInit {
  email = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    // Read email from query param like: ?email=user@example.com
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';

      if (!this.email) {
        this.toastr.error("You're not authorized to be here. Redirecting to sign-in.", "Unauthorized Access");
        this.router.navigate(['/sign-in']);
      }
    });
  }

  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.toastr.warning('Please fill in both new password and confirm password fields.', 'Input Required');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Passwords do not match!', 'Password Mismatch');
      return;
    }

    this.http.put('http://localhost:3000/api/update-password', {
      email: this.email,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.toastr.success('Password updated successfully!', 'Success'); // Success toast
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        console.error('Failed to update password:', err); // Log the actual error
        this.toastr.error('Failed to update password. Please try again.', 'Error'); // Error toast
      }
    });
  }
}
