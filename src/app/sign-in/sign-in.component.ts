import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Adjust path

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
    private authService: AuthService
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
            alert('Signin failed! Invalid response from server.');
            return;
          }

          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userId', response._id);

          this.authService.setAdminStatus(response.isAdmin || false);

          alert('Signin success!');
          console.log(response);
          if (response.mustUpdate) {
            this.router.navigate(['/update-password']);
          } else if (response.isAdmin) {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('[ERROR] Signin failed:', error);
          alert('Signin failed! Invalid email or password.');
        },
      });
  }
}
