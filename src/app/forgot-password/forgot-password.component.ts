import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ import Router
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {} // ✅ inject Router

  submit() {
    this.http
      .post('http://localhost:3000/api/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          this.toast.success('Temporary password sent to your email!');
          this.router.navigate(['/sign-in']); // ✅ redirect
        },
        error: () => this.toast.error('Failed to send password. Try again.'),
      });
  }
}
