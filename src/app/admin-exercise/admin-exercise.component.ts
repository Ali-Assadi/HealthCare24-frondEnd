import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-exercise',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-exercise.component.html',
  styleUrls: ['./admin-exercise.component.css']
})
export class AdminExerciseComponent implements OnInit {
  exercises: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  selectedIndex: number | null = null;
  searchEmail: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExercisePlans();
  }

  loadExercisePlans(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/exercises').subscribe({
      next: (data) => {
        this.exercises = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error('Failed to load exercise plans:', err),
    });
  }

  searchByEmail(): void {
    const email = this.searchEmail.trim().toLowerCase();
    this.filteredUsers = email
      ? this.exercises.filter(user => user.email.toLowerCase().includes(email))
      : this.exercises;
    this.selectedUser = null;
    this.selectedIndex = null;
  }

  selectUser(user: any, index: number): void {
    const safeUser = JSON.parse(JSON.stringify(user));
    if (!safeUser.exercisePlan) {
      safeUser.exercisePlan = [];
    }
    this.selectedUser = safeUser;
    this.selectedIndex = index;
  }

  updateDay(weekIndex: number, dayIndex: number, field: string, value: string): void {
    if (this.selectedUser?.exercisePlan[weekIndex]?.days[dayIndex]) {
      this.selectedUser.exercisePlan[weekIndex].days[dayIndex][field] = value;
    }
  }

  addDay(weekIndex: number): void {
    const week = this.selectedUser.exercisePlan[weekIndex];
    if (!week.days) week.days = [];

    if (week.days.length >= 7) {
      alert("⚠️ A week cannot have more than 7 days.");
      return;
    }

    week.days.push({ day: 0, type: '', workout: '' });
    this.selectedUser = { ...this.selectedUser };
  }

  removeDay(weekIndex: number, dayIndex: number): void {
    this.selectedUser.exercisePlan[weekIndex].days.splice(dayIndex, 1);
    this.selectedUser = { ...this.selectedUser };
  }

  addWeek(): void {
    if (this.selectedUser.exercisePlan.length >= 5) {
      alert("⚠️ Cannot add more than 5 weeks.");
      return;
    }

    this.selectedUser.exercisePlan.push({
      week: this.selectedUser.exercisePlan.length + 1,
      days: []
    });

    this.selectedUser = { ...this.selectedUser };
  }

  removeWeek(weekIndex: number): void {
    this.selectedUser.exercisePlan.splice(weekIndex, 1);
    this.selectedUser = { ...this.selectedUser };
  }

  saveChanges(): void {
    if (!this.selectedUser?.email) return;
    this.http.put(`http://localhost:3000/api/admin/exercises/${this.selectedUser.email}`, {
      exercisePlan: this.selectedUser.exercisePlan,
    }).subscribe({
      next: () => {
        alert(`✅ Exercise plan updated for ${this.selectedUser.email}`);
        this.exercises[this.selectedIndex!] = { ...this.selectedUser };
        this.searchByEmail();
      },
      error: () => alert('Failed to update exercise plan'),
    });
  }
}
