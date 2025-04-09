import { Component, OnInit } from '@angular/core'; // ✅ import OnInit
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // ✅ import ActivatedRoute

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent implements OnInit { // ✅ implement OnInit
  email = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // ✅ inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ✅ Read email from query param like: ?email=user@example.com
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';

      if (!this.email) {
        alert("You're not authorized to be here.");
        this.router.navigate(['/sign-in']);
      }
    });
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.http.put('http://localhost:3000/api/update-password', {
      email: this.email,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        alert('Password updated successfully!');
        this.router.navigate(['/sign-in']);
      },
      error: () => {
        alert('Failed to update password.');
      }
    });
  }
}
