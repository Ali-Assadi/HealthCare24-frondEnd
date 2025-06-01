import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Add this

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ Include CommonModule here
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  email: string = '';
  showForm: boolean = false;

  age: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  details: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.email = localStorage.getItem('userEmail') || '';

    if (this.email) {
      this.http.get<any>(`http://localhost:3000/api/user/${this.email}`).subscribe({
        next: (user) => {
          this.age = user.age;
          this.height = user.height;
          this.weight = user.weight;
          this.details = user.details;
        },
        error: (err) => {
          console.error('Failed to load user', err);
        }
      });
    }
  }

  submitUpdate() {
    const updatedData = {
      age: this.age,
      height: this.height,
      weight: this.weight,
      details: this.details
    };

    this.http.put(`http://localhost:3000/api/user/${this.email}`, updatedData).subscribe({
      next: () => {
        alert('✅ Details updated!');
        this.showForm = false;
      },
      error: () => {
        alert('❌ Failed to update user');
      }
    });
  }
  deleteAccount() {
    if (!confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone.')) return;
  
    this.http.delete(`http://localhost:3000/api/user/${this.email}`).subscribe({
      next: () => {
        alert('Your account has been deleted.');
        localStorage.removeItem('userEmail');
        window.location.href = '/sign-in'; // Redirect to login
      },
      error: () => {
        alert('Failed to delete account.');
      }
    });
  }
  
}
