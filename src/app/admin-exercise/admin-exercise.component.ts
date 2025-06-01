import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.loadExercisePlans();
  }

  loadExercisePlans(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/exercises').subscribe({
      next: (data) => {
        this.exercises = data;
        this.filteredUsers = data;
        this.toastr.success('Exercise plans loaded successfully!', 'Success'); // Success toast for loading
      },
      error: (err) => {
        console.error('Failed to load exercise plans:', err);
        this.toastr.error('Failed to load exercise plans.', 'Error'); // Error toast for loading
      },
    });
  }

  searchByEmail(): void {
    const email = this.searchEmail.trim().toLowerCase();
    this.filteredUsers = email
      ? this.exercises.filter(user => user.email.toLowerCase().includes(email))
      : this.exercises;

    if (!email) {
      this.toastr.info('Displaying all exercise plans.', 'Search Cleared');
    } else if (this.filteredUsers.length === 0) {
      this.toastr.info('No exercise plans found for this email.', 'No Results');
    } else {
      this.toastr.success('Exercise plans filtered by email.', 'Search Complete');
    }
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
    this.toastr.info(`Selected exercise plan for ${user.email}.`, 'User Selected');
  }

  updateDay(weekIndex: number, dayIndex: number, field: string, value: string): void {
    if (this.selectedUser?.exercisePlan[weekIndex]?.days[dayIndex]) {
      this.selectedUser.exercisePlan[weekIndex].days[dayIndex][field] = value;
      this.toastr.info('Exercise day updated locally.', 'Day Updated');
    } else {
      this.toastr.error('Could not update exercise day. Please select a user and a valid day.', 'Update Failed');
    }
  }

  addDay(weekIndex: number): void {
    const week = this.selectedUser.exercisePlan[weekIndex];
    if (!week.days) week.days = [];

    if (week.days.length >= 7) {
      this.toastr.warning("A week cannot have more than 7 days.", "Limit Reached");
      return;
    }

    week.days.push({ day: 0, type: '', workout: '' });
    this.selectedUser = { ...this.selectedUser }; // Trigger change detection
    this.toastr.success('New day added to the week.', 'Day Added');
  }

  removeDay(weekIndex: number, dayIndex: number): void {
    this.selectedUser.exercisePlan[weekIndex].days.splice(dayIndex, 1);
    this.selectedUser = { ...this.selectedUser }; // Trigger change detection
    this.toastr.success('Day removed from the week.', 'Day Removed');
  }

  addWeek(): void {
    if (this.selectedUser.exercisePlan.length >= 5) {
      this.toastr.warning("Cannot add more than 5 weeks.", "Limit Reached");
      return;
    }

    this.selectedUser.exercisePlan.push({
      week: this.selectedUser.exercisePlan.length + 1,
      days: []
    });

    this.selectedUser = { ...this.selectedUser }; // Trigger change detection
    this.toastr.success('New week added to the exercise plan.', 'Week Added');
  }

  removeWeek(weekIndex: number): void {
    this.selectedUser.exercisePlan.splice(weekIndex, 1);
    this.selectedUser = { ...this.selectedUser }; // Trigger change detection
    this.toastr.success('Week removed from the exercise plan.', 'Week Removed');
  }

  saveChanges(): void {
    if (!this.selectedUser?.email) {
      this.toastr.error('No user selected to save changes.', 'Save Failed');
      return;
    }
    this.http.put(`http://localhost:3000/api/admin/exercises/${this.selectedUser.email}`, {
      exercisePlan: this.selectedUser.exercisePlan,
    }).subscribe({
      next: () => {
        this.toastr.success(`Exercise plan updated for ${this.selectedUser.email} successfully!`, 'Update Success');
        this.exercises[this.selectedIndex!] = { ...this.selectedUser };
        this.searchByEmail(); // Refresh list
      },
      error: (err) => {
        console.error('Failed to update exercise plan:', err);
        this.toastr.error('Failed to update exercise plan.', 'Update Failed');
      },
    });
  }
}
