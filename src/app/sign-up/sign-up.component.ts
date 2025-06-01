import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  email = '';
  password = '';
  confirmPassword = '';

  age: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  details = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  signUp() {
    if (
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.age ||
      !this.height ||
      !this.weight ||
      !this.details
    ) {
      this.toastr.warning('Please fill all fields.', '⚠️ Incomplete Form');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match!', '❌ Error');
      return;
    }

    const userData = {
      email: this.email,
      password: this.password,
      age: this.age,
      height: this.height,
      weight: this.weight,
      details: this.details,
    };

    this.http.post('http://localhost:3000/api/signup', userData).subscribe({
      next: () => {
        this.toastr.success('Signup success!', '🎉 Welcome!');
        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 2000);
      },
      error: (error) => {
        console.error('Signup failed', error);
        this.toastr.error('Signup failed. Please try again.', '❌ Error');
      },
    });
  }
}
