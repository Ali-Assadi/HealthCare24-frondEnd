import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./admin-users.component.css'],
  standalone: true,
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  searchQuery: string = '';
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/users').subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Failed to load users:', err),
    });
  }

  private confirmDeleteId: string | null = null;

  deleteUser(id: string): void {
    if (this.confirmDeleteId === id) {
      this.http
        .delete(`http://localhost:3000/api/admin/users/${id}`)
        .subscribe({
          next: () => {
            this.toastr.success('✅ User deleted successfully');
            this.loadUsers();
            this.confirmDeleteId = null;
          },
          error: () => {
            this.toastr.error('❌ Failed to delete user');
            this.confirmDeleteId = null;
          },
        });
    } else {
      this.confirmDeleteId = id;
      this.toastr.warning(
        '⚠️ Press delete again to confirm',
        'Confirm Deletion',
        {
          timeOut: 3000,
        }
      );
      setTimeout(() => {
        if (this.confirmDeleteId === id) {
          this.confirmDeleteId = null;
        }
      }, 3000);
    }
  }

  clearDietPlan(id: string): void {
    this.http
      .put(`http://localhost:3000/api/admin/users/${id}/clear-plan`, {})
      .subscribe({
        next: () => {
          this.toastr.success('🥗 Diet plan cleared!');
          this.loadUsers();
        },
        error: () => this.toastr.error('❌ Failed to clear diet plan'),
      });
  }

  clearExercisePlan(id: string): void {
    this.http
      .put(`http://localhost:3000/api/admin/users/${id}/clear-exercise`, {})
      .subscribe({
        next: () => {
          this.toastr.success('💪 Exercise plan cleared!');
          this.loadUsers();
        },
        error: () => this.toastr.error('❌ Failed to clear exercise plan'),
      });
  }
  get filteredUsers(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.users.filter((user) =>
      user.email.toLowerCase().includes(query)
    );
  }
}
