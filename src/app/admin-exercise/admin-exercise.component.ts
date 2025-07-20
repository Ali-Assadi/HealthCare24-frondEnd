import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-exercise',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-exercise.component.html',
  styleUrls: ['./admin-exercise.component.css'],
})
export class AdminExerciseComponent implements OnInit {
  exercises: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  selectedIndex: number | null = null;
  searchEmail: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadExercisePlans();
  }

  loadExercisePlans(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/admin/exercises')
      .subscribe({
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
      ? this.exercises.filter((user) =>
          user.email.toLowerCase().includes(email)
        )
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

  updateDay(
    weekIndex: number,
    dayIndex: number,
    field: string,
    value: string
  ): void {
    if (this.selectedUser?.exercisePlan[weekIndex]?.days[dayIndex]) {
      this.selectedUser.exercisePlan[weekIndex].days[dayIndex][field] = value;
    }
  }

  addDay(weekIndex: number): void {
    const week = this.selectedUser.exercisePlan[weekIndex];
    if (!week.days) week.days = [];

    if (week.days.length >= 7) {
      this.toastr.warning('A week cannot have more than 7 days.');
      return;
    }

    week.days.push({ day: 0, type: '', workout: '' });
    this.selectedUser = { ...this.selectedUser };
  }

  removeDay(weekIndex: number, dayIndex: number): void {
    if (confirm('Delete this day?')) {
      this.selectedUser.exercisePlan[weekIndex].days.splice(dayIndex, 1);
      this.selectedUser = { ...this.selectedUser };
      this.toastr.info('🗑️ Day removed');
    }
  }

  addWeek(): void {
    if (this.selectedUser.exercisePlan.length >= 5) {
      this.toastr.warning('Cannot add more than 5 weeks.');
      return;
    }

    this.selectedUser.exercisePlan.push({
      week: this.selectedUser.exercisePlan.length + 1,
      days: [],
    });

    this.selectedUser = { ...this.selectedUser };
  }

  removeWeek(weekIndex: number): void {
    if (confirm('Are you sure you want to delete this week?')) {
      this.selectedUser.exercisePlan.splice(weekIndex, 1);
      this.selectedUser = { ...this.selectedUser };
      this.toastr.info('🗑️ Week removed');
    }
  }

  saveChanges(): void {
    if (!this.selectedUser?.email) return;
    this.http
      .put(
        `http://localhost:3000/api/admin/exercises/${this.selectedUser.email}`,
        {
          exercisePlan: this.selectedUser.exercisePlan,
        }
      )
      .subscribe({
        next: () => {
          this.toastr.success(
            `✅ Exercise plan updated for ${this.selectedUser.email}`
          );
          this.exercises[this.selectedIndex!] = { ...this.selectedUser };
          this.searchByEmail();
        },
        error: () => this.toastr.error('❌ Failed to update exercise plan'),
      });
  }
  scrollToTop(): void {
    this.smoothScrollBy(-800); // Scroll up smoothly
  }

  scrollToBottom(): void {
    this.smoothScrollBy(800); // Scroll down smoothly
  }

  smoothScrollBy(offset: number, duration: number = 500): void {
    const start = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // Clamp to [0, 1]
      const ease = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      window.scrollTo(0, start + offset * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
}
