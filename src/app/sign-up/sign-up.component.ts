import { Component } from '@angular/core';
import { RouterLink ,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient , private router : Router) {}

  signUp() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
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

    this.http.post('http://localhost:3000/api/signup', userData).subscribe(
      (response) => {
        console.log(response);
        alert('Signup success!');
        this.router.navigate(['/sign-in']);
      },
      (error) => {
        console.error(error);
        alert('Signup failed!');
      }
    );
  }
}
