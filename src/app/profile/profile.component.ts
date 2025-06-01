import { Component, OnInit } from '@angular/core'; // Added OnInit
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit { // Implemented OnInit
  email: string = '';
  showForm: boolean = false;

  age: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  details: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    this.email = localStorage.getItem('userEmail') || '';

    if (this.email) {
      this.http.get<any>(`http://localhost:3000/api/user/${this.email}`).subscribe({
        next: (user) => {
          this.age = user.age;
          this.height = user.height;
          this.weight = user.weight;
          this.details = user.details;
          this.toastr.success('Profile loaded successfully!', 'Success'); // Success toast for loading
        },
        error: (err) => {
          console.error('Failed to load user:', err);
          this.toastr.error('Failed to load your profile data.', 'Error'); // Error toast for loading
        }
      });
    } else {
      this.toastr.warning('Please log in to view your profile.', 'Login Required'); // Warning if no email
    }
  }

  submitUpdate() {
    if (!this.email) {
      this.toastr.error('User email not found. Cannot update profile.', 'Error');
      return;
    }

    const updatedData = {
      age: this.age,
      height: this.height,
      weight: this.weight,
      details: this.details
    };

    this.http.put(`http://localhost:3000/api/user/${this.email}`, updatedData).subscribe({
      next: () => {
        this.toastr.success('Details updated successfully!', 'Profile Updated'); // Success toast
        this.showForm = false;
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        this.toastr.error('Failed to update your profile.', 'Error'); // Error toast
      }
    });
  }

  deleteAccount() {
    // Replaced confirm() with direct action and toast feedback.
    // For critical operations like account deletion, consider a custom confirmation modal.
    this.toastr.info('Attempting to delete account...', 'Deleting Account');

    this.http.delete(`http://localhost:3000/api/user/${this.email}`).subscribe({
      next: () => {
        this.toastr.success('Your account has been deleted.', 'Account Deleted'); // Success toast
        localStorage.removeItem('userEmail');
        setTimeout(() => { // Add a small delay for the toast to be seen
          window.location.href = '/sign-in'; // Redirect to login
        }, 2000);
      },
      error: (err) => {
        console.error('Failed to delete account:', err);
        this.toastr.error('Failed to delete account. Please try again.', 'Error'); // Error toast
      }
    });
  }
}
