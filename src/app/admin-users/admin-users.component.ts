import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  imports:[CommonModule],
  styleUrls: ['./admin-users.component.css'],
  standalone: true,
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/users').subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:3000/api/admin/users/${id}`).subscribe({
        next: () => this.loadUsers(),
        error: () => alert('❌ Failed to delete user')
      });
    }
  }

  clearDietPlan(id: string): void {
    this.http.put(`http://localhost:3000/api/admin/users/${id}/clear-plan`, {}).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('❌ Failed to clear diet plan')
    });
  }
  
  clearExercisePlan(id: string): void {
    this.http.put(`http://localhost:3000/api/admin/users/${id}/clear-exercise`, {}).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('❌ Failed to clear exercise plan')
    });
  }  
}
