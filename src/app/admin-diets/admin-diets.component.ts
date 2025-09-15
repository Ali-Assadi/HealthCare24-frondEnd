import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-diets',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-diets.component.html',
  styleUrls: ['./admin-diets.component.css'],
})
export class AdminDietsComponent implements OnInit {
  diets: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchEmail: string = '';
  selectedIndex: number | null = null;
  completedDays = 0;
  totalDays = 0;
  progressPercent = 0;

  constructor(private http: HttpClient, private toast: ToastrService) {}

  ngOnInit(): void {
    this.loadDiets();
  }

  loadDiets() {
    this.http.get<any[]>('http://localhost:3000/api/admin/diets').subscribe({
      next: (data) => {
        this.diets = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error('Failed to load diets:', err),
    });
  }
  private calculateProgress(): void {
    if (!this.selectedUser?.dietPlan) {
      this.completedDays = 0;
      this.totalDays = 0;
      this.progressPercent = 0;
      return;
    }

    let completed = 0;
    let total = 0;

    for (const week of this.selectedUser.dietPlan) {
      const days = week?.days ?? [];
      for (const day of days) {
        total++;
        if (day?.finished === true) completed++;
      }
    }

    this.completedDays = completed;
    this.totalDays = total;
    this.progressPercent =
      total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  searchByEmail(): void {
    const email = this.searchEmail.trim().toLowerCase();
    if (!email) {
      this.filteredUsers = this.diets;
    } else {
      this.filteredUsers = this.diets.filter((user) =>
        user.email.toLowerCase().includes(email)
      );
    }
    this.selectedUser = null;
    this.selectedIndex = null;
  }

  selectUser(user: any, index: number): void {
    this.selectedUser = JSON.parse(JSON.stringify(user)); // Deep copy for safe editing
    this.selectedIndex = index;
    this.calculateProgress();
  }

  updateMeal(weekIndex: number, dayIndex: number, type: string, value: string) {
    if (this.selectedUser?.dietPlan[weekIndex]?.days[dayIndex]) {
      this.selectedUser.dietPlan[weekIndex].days[dayIndex][type] = value;
    }
  }

  addSnack(day: any): void {
    day.snack = 'New Snack';
  }

  addWeek(): void {
    if (this.selectedUser.dietPlan.length >= 5) {
      this.toast.warning('⚠️ Maximum of 5 weeks allowed per plan.');
      return;
    }

    this.selectedUser.dietPlan.push({
      days: [
        {
          breakfast: '',
          lunch: '',
          dinner: '',
          snack: '',
        },
      ],
    });
  }

  deleteWeek(index: number): void {
    if (confirm('Are you sure you want to delete this week?')) {
      this.selectedUser.dietPlan.splice(index, 1);
      this.toast.info('🗑️ Week deleted.');
      this.calculateProgress();
    }
  }

  addDay(weekIndex: number): void {
    const days = this.selectedUser.dietPlan[weekIndex].days;
    if (days.length >= 7) {
      this.toast.warning('⚠️ There is no 8 days in a week, Don’t try.');
      return;
    }
    days.push({ breakfast: '', lunch: '', dinner: '', snack: '' });
    this.calculateProgress();
  }

  deleteDay(weekIndex: number, dayIndex: number): void {
    if (confirm('Delete this day?')) {
      this.selectedUser.dietPlan[weekIndex].days.splice(dayIndex, 1);
      this.toast.info('🗑️ Day deleted.');
      this.calculateProgress();
    }
  }

  saveChanges(): void {
    if (!this.selectedUser?.email) return;

    this.http
      .put(`http://localhost:3000/api/admin/diets/${this.selectedUser.email}`, {
        dietPlan: this.selectedUser.dietPlan,
      })
      .subscribe({
        next: () => {
          this.toast.success(`✅ Diet updated for ${this.selectedUser.email}`);
          this.diets[this.selectedIndex!] = { ...this.selectedUser };
          this.searchByEmail();
        },
        error: () => {
          this.toast.error('❌ Failed to update diet');
        },
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
