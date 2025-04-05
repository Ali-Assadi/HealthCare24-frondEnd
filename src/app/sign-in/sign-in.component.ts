import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  signIn() {
    this.http.post<any>('http://localhost:3000/api/signin', {
      email: this.email,
      password: this.password
    }).subscribe(response => {
      console.log(response);
      alert('Signin success!');
      localStorage.setItem('userEmail', this.email);
    
      // Check if it's a temp password login
      if (response.mustUpdate) {
        this.router.navigate(['/update-password']);
      } else {
        this.router.navigate(['/user-home']);
      }
    }, error => {
      console.error(error);
      alert('Signin failed! Invalid email or password.');
    });
    
  }
}
