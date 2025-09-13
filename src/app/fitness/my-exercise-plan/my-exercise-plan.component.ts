import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-exercise-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-exercise-plan.component.html',
  styleUrls: ['./my-exercise-plan.component.css'],
})
export class MyExercisePlanComponent implements OnInit {
  exercisePlan: any[] = [];
  goal = '';
  loading = true;
  userEmail = localStorage.getItem('userEmail') || '';

  updatedWeight: number | null = null;
  updatedDetails = '';
  review = '';
  reviewSubmitted = false;
  hasReviewedExercise = false;
  isSubscribed = false;

  // single restriction that affects suggestions
  userRestriction: string = 'default';

  completedDays = 0;
  totalDays = 0;
  progressPercent = 0;
  showCongratulations = false;

  customizingWeek: number | null = null;
  customizingDay: number | null = null;

  availableExercises: string[] = [];
  editWorkout: string[] = []; // <-- edit buffer for the 3 selects

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // comparator & trackBy for robust select binding
  stringCompare = (a: any, b: any) =>
    (a ?? '').toString().trim() === (b ?? '').toString().trim();
  trackByString = (_: number, v: string) => v;

  ngOnInit(): void {
    this.http
      .get<any>(`http://localhost:3000/api/user/${this.userEmail}`)
      .subscribe({
        next: (userData) => {
          this.hasReviewedExercise = userData.hasReviewedExercise || false;
          this.isSubscribed = userData.isSubscribed || false;

          // prefer single value; fall back to first legacy value; else default
          this.userRestriction =
            userData.exerciseRestriction ||
            (Array.isArray(userData.exerciseRestrictions) &&
              userData.exerciseRestrictions[0]) ||
            'default';

          this.loadExercisePlan();
        },
        error: () => {
          this.toastr.error('❌ Failed to load user profile.');
          this.loading = false;
        },
      });
  }

  loadExercisePlan(): void {
    this.http
      .get<any>(`http://localhost:3000/api/exercise/plan/${this.userEmail}`)
      .subscribe({
        next: (data) => {
          this.exercisePlan = data.exercisePlan || [];
          this.goal = data.goal || '';
          this.addFinishedFieldIfMissing();
          this.calculateProgress();
          this.loading = false;
        },
        error: () => {
          this.toastr.error('❌ Failed to load exercise plan.');
          this.loading = false;
        },
      });
  }

  submitReview(): void {
    const payload = {
      email: this.userEmail,
      weight: this.updatedWeight,
      details: this.updatedDetails,
      text: this.review,
      type: 'exercise',
    };

    this.http
      .post(`http://localhost:3000/api/user/${this.userEmail}/review`, payload)
      .subscribe({
        next: () => {
          this.toastr.success('✅ Thank you for your feedback!');
          this.reviewSubmitted = true;
          this.hasReviewedExercise = true;
          this.showCongratulations = false;
        },
        error: () => this.toastr.error('❌ Failed to submit feedback'),
      });
  }

  addFinishedFieldIfMissing(): void {
    for (const week of this.exercisePlan) {
      for (const day of week.days) {
        if (day.finished === undefined) day.finished = false;
      }
    }
  }

  markDayFinished(weekIndex: number, dayIndex: number): void {
    this.exercisePlan[weekIndex].days[dayIndex].finished = true;
    this.calculateProgress();

    this.http
      .patch(
        'http://localhost:3000/api/exercise/update-finished-exercise-day',
        {
          email: this.userEmail,
          weekIndex,
          dayIndex,
        }
      )
      .subscribe({
        next: () => console.log('✅ Exercise day marked as finished in DB!'),
        error: (err) =>
          console.error('❌ Failed to update exercise day in DB', err),
      });
  }

  restartPlan(): void {
    const confirmReset = window.confirm(
      'Are you sure you want to restart the plan? This will reset all progress!'
    );
    if (!confirmReset) {
      this.toastr.info('Reset cancelled.');
      return;
    }

    for (const week of this.exercisePlan) {
      for (const day of week.days) day.finished = false;
    }
    this.calculateProgress();

    this.http
      .patch('http://localhost:3000/api/exercise/reset-finished-exercise', {
        email: this.userEmail,
      })
      .subscribe({
        next: () => this.toastr.success('✅ Exercise plan has been reset!'),
        error: () => this.toastr.error('❌ Failed to reset exercise plan'),
      });
  }

  calculateProgress(): void {
    let completed = 0;
    let total = 0;
    for (const week of this.exercisePlan) {
      for (const day of week.days) {
        total++;
        if (day.finished) completed++;
      }
    }
    this.completedDays = completed;
    this.totalDays = total;
    this.progressPercent =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    this.showCongratulations = this.progressPercent === 100;
  }

  generateNewPlan(): void {
    this.http
      .patch('http://localhost:3000/api/exercise/reset-plan-after-review', {
        email: this.userEmail,
      })
      .subscribe({
        next: () => {
          this.toastr.success('✅ Cleared current plan');
          window.location.href = '/exercise-plan';
        },
        error: () => this.toastr.error('❌ Failed to reset exercise plan'),
      });
  }

  /** Open the editor: build options = current 3 + suggestions (de-duped) */
  toggleCustomization(w: number, d: number): void {
    this.customizingWeek = w;
    this.customizingDay = d;

    // current 3 exercises (copy into buffer)
    const current = (this.exercisePlan[w]?.days?.[d]?.workout ??
      []) as string[];
    this.editWorkout = [current[0] ?? '', current[1] ?? '', current[2] ?? ''];

    const restriction = this.userRestriction || 'default';

    this.http
      .get<any>(
        `http://localhost:3000/api/exercise/suggestions?goal=${this.goal}&restriction=${restriction}`
      )
      .subscribe({
        next: (res) => {
          const suggestions = Array.isArray(res.exercises) ? res.exercises : [];
          const merged = [...current, ...suggestions];

          // de-dup while preserving order
          const seen = new Set<string>();
          this.availableExercises = merged
            .map((s) => (s ?? '').toString().trim())
            .filter((s) => {
              if (seen.has(s)) return false;
              seen.add(s);
              return !!s;
            });

          // ensure all 3 buffer values are present in options
          for (let i = 0; i < 3; i++) {
            if (
              !this.editWorkout[i] ||
              !this.availableExercises.includes(this.editWorkout[i])
            ) {
              this.editWorkout[i] = this.availableExercises[0] ?? '';
            }
          }
        },
        error: () => {
          // fallback: allow editing current only
          const seen = new Set<string>();
          this.availableExercises = current
            .map((s) => (s ?? '').toString().trim())
            .filter((s) => {
              if (seen.has(s)) return false;
              seen.add(s);
              return !!s;
            });
          for (let i = 0; i < 3; i++) {
            if (!this.editWorkout[i])
              this.editWorkout[i] = this.availableExercises[0] ?? '';
          }
          this.toastr.error('❌ Failed to fetch suggestions');
        },
      });
  }

  /** Persist the edited day */
  saveCustomizedDay(w: number, d: number): void {
    const updatedWorkout = [...this.editWorkout];

    this.http
      .patch(`http://localhost:3000/api/exercise/customize-day`, {
        email: this.userEmail,
        weekIndex: w,
        dayIndex: d,
        newWorkout: updatedWorkout,
      })
      .subscribe({
        next: () => {
          // update local plan after success
          this.exercisePlan[w].days[d].workout = updatedWorkout;
          this.toastr.success('✅ Day updated!');
          this.customizingWeek = null;
          this.customizingDay = null;
        },
        error: () => this.toastr.error('❌ Failed to update day'),
      });
  }

  // smooth scrolling & export kept as-is
  scrollToTop(): void {
    this.smoothScrollBy(-800);
  }
  scrollToBottom(): void {
    this.smoothScrollBy(800);
  }

  smoothScrollBy(offset: number, duration: number = 500): void {
    const start = window.scrollY;
    const startTime = performance.now();
    const animate = (t: number) => {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start + offset * ease);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  downloadExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exercise Plan');

    const headerRow = worksheet.addRow([
      'Week',
      'Day',
      'Type',
      'Workout',
      'Finished',
    ]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '6c5ce7' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    for (const week of this.exercisePlan) {
      for (const day of week.days) {
        const row = worksheet.addRow([
          week.week,
          day.day,
          day.type,
          day.workout,
          day.finished ? 'Yes' : 'No',
        ]);
        const finishedCell = row.getCell(5);
        finishedCell.font = {
          color: { argb: day.finished ? '00C853' : 'D50000' },
        };
        finishedCell.alignment = { horizontal: 'center' };
      }
    }

    worksheet.columns?.forEach((column) => {
      if (!column) return;
      let maxLength = 10;
      column.eachCell?.({ includeEmpty: true }, (cell: any) => {
        if (cell.value) {
          const length = cell.value.toString().length;
          if (length > maxLength) maxLength = length;
        }
      });
      column.width = maxLength + 5;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'exercise-plan-styled.xlsx');
    });
  }
}
