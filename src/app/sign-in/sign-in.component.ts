import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  signIn() {
    this.http
      .post<any>('http://localhost:3000/api/signin', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          if (!response || !response.email) {
            this.toastr.error(
              'Invalid response from server.',
              '❌ Signin Failed'
            );
            return;
          }

          // 🔒 Check if password update is required before storing login
          const mustUpdate = !!(
            response.mustUpdatePassword ??
            response.user?.mustUpdatePassword ??
            response.mustUpdate
          );

          if (mustUpdate) {
            this.toastr.info(
              'Please set a new password to continue.',
              'Security check'
            );
            this.router.navigate(['/update-password'], {
              queryParams: { email: response.email },
              replaceUrl: true,
            });
            return; // 🚫 Don't save login data
          }

          // ✅ Only store login if password update is NOT required
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userId', response._id);
          this.authService.setAdminStatus(response.isAdmin || false);

          // Normal flow
          this.toastr.success('Login successful! 🎉', 'Welcome!');
          if (response.isAdmin) {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('[ERROR] Signin failed:', error);
          this.toastr.error('Invalid email or password.', '❌ Signin Failed');
        },
      });
  }
}
