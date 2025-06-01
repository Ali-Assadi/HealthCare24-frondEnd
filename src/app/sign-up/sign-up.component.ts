import { Component } from '@angular/core';
import { RouterLink ,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  email = '';
  password = '';
  confirmPassword = '';

  age: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  details = '';

  constructor(private http: HttpClient , private router : Router, private toastr: ToastrService) {} // Inject ToastrService

  signUp() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.toastr.warning('Please fill in all required fields (Email, Password, Confirm Password).', 'Input Required');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match!', 'Password Mismatch');
      return;
    }

    const userData = {
      email: this.email,
      password: this.password,
      age: this.age,
      height: this.height,
      weight: this.weight,
      details: this.details
    };

    this.http.post('http://localhost:3000/api/signup', userData).subscribe({
      next: (response) => { // Use next and error properties for HttpClient subscribe
        console.log(response);
        this.toastr.success('Signup success!', 'Welcome!'); // Success toast
        this.router.navigate(['/sign-in']);
      },
      error: (error) => { // Use next and error properties for HttpClient subscribe
        console.error(error);
        const errorMessage = error.error?.message || 'Something went wrong during signup.';
        this.toastr.error(`Signup failed! ${errorMessage}`, 'Error'); // Error toast
      }
    });
  }
}
