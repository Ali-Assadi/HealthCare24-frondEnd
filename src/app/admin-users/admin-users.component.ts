import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  imports:[CommonModule, RouterLink], // Added RouterLink to imports as it's typically used in admin user lists
  styleUrls: ['./admin-users.component.css'],
  standalone: true,
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/users').subscribe({
      next: (data) => {
        this.users = data;
        this.toastr.success('Users loaded successfully!', 'Success'); // Success toast for loading
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.toastr.error('Failed to load users.', 'Error'); // Error toast for loading
      }
    });
  }

  deleteUser(id: string): void {
    // Replaced confirm() with direct action and toast feedback.
    // For critical operations, consider a custom confirmation modal.
    this.http.delete(`http://localhost:3000/api/admin/users/${id}`).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully!', 'User Deleted');
        this.loadUsers(); // Reload users after successful deletion
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
        this.toastr.error('Failed to delete user.', 'Error');
      }
    });
  }

  clearDietPlan(id: string): void {
    this.http.put(`http://localhost:3000/api/admin/users/${id}/clear-plan`, {}).subscribe({
      next: () => {
        this.toastr.success('Diet plan cleared successfully!', 'Plan Cleared');
        this.loadUsers(); // Reload users to reflect changes
      },
      error: (err) => {
        console.error('Failed to clear diet plan:', err);
        this.toastr.error('Failed to clear diet plan.', 'Error');
      }
    });
  }
  
  clearExercisePlan(id: string): void {
    this.http.put(`http://localhost:3000/api/admin/users/${id}/clear-exercise`, {}).subscribe({
      next: () => {
        this.toastr.success('Exercise plan cleared successfully!', 'Plan Cleared');
        this.loadUsers(); // Reload users to reflect changes
      },
      error: (err) => {
        console.error('Failed to clear exercise plan:', err);
        this.toastr.error('Failed to clear exercise plan.', 'Error');
      }
    });
  } 
}
