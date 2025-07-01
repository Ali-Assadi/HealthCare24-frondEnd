import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-diet-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-diet-plan.component.html',
  styleUrls: ['./my-diet-plan.component.css'],
})
export class MyDietPlanComponent implements OnInit {
  completedDays: number = 0;
  totalDays: number = 0;
  progressPercent: number = 0;
  showCongratulations: boolean = false;
  showReviewModal = false;

  userInfo: any = {};
  userGoal = '';
  generatedPlans: any[] = [];
  showAllWeeks: boolean = false;
  userEmail: string = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.userEmail = email;
    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.userGoal = user.goal || '';
        this.generatedPlans = user.dietPlan || [];

        console.log('🧠 Loaded diet plan from server:', this.generatedPlans);
        this.calculateProgress();
      },
      error: () => console.error('❌ Failed to fetch user plan.'),
    });
  }

  finishDay(weekIndex: number, dayIndex: number): void {
    this.generatedPlans[weekIndex].days[dayIndex].finished = true;

    this.http
      .patch('http://localhost:3000/api/update-finished-day', {
        email: this.userEmail,
        weekIndex,
        dayIndex,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Day marked as completed!', '✅ Nice work!');
          this.calculateProgress();
        },
        error: (err) => {
          console.error('❌ Failed to update finished day', err);
        },
      });
  }

  resetPlan(): void {
    const confirmed = window.confirm(
      'Are you sure you want to restart your diet plan? This will reset all progress.'
    );
    if (!confirmed) {
      this.toastr.info('Reset cancelled.', '✋ Cancelled');
      return;
    }

    for (let week of this.generatedPlans) {
      for (let day of week.days) {
        day.finished = false;
      }
    }
    this.calculateProgress();

    this.http
      .patch('http://localhost:3000/api/reset-finished-diet', {
        email: this.userEmail,
      })
      .subscribe({
        next: () => {
          this.toastr.success('✅ Diet Plan has been restarted!', 'Plan Reset');
        },
        error: () => {
          this.toastr.error('❌ Failed to restart diet plan.', 'Error');
        },
      });
  }

  handleReviewSubmission(data: {
    review: string;
    weight: number;
    details: string;
  }) {
    const { review, weight, details } = data;

    this.http
      .patch(`http://localhost:3000/api/user/update-after-diet`, {
        email: this.userEmail,
        review,
        weight,
        details,
      })
      .subscribe({
        next: () => {
          this.toastr.success('🎉 Review submitted!');
          this.showReviewModal = false;
          this.userInfo.hasReviewedDiet = true;
        },
        error: () => {
          this.toastr.error('❌ Failed to update review');
        },
      });
  }

  calculateProgress(): void {
    let completed = 0;
    let total = 0;

    console.log('📊 Starting progress calculation...');
    console.log('📦 Raw diet plan data:', this.generatedPlans);

    for (
      let weekIndex = 0;
      weekIndex < this.generatedPlans.length;
      weekIndex++
    ) {
      const week = this.generatedPlans[weekIndex];
      console.log(`📅 Week ${weekIndex + 1}:`);

      for (let dayIndex = 0; dayIndex < week.days.length; dayIndex++) {
        const day = week.days[dayIndex];
        total++;
        if (day.finished) {
          completed++;
          console.log(
            `✅ Day ${dayIndex + 1} - finished: YES | (${completed}/${total})`
          );
        } else {
          console.log(
            `❌ Day ${dayIndex + 1} - finished: NO | (${completed}/${total})`
          );
        }
      }
    }

    this.completedDays = completed;
    this.totalDays = total;
    this.progressPercent =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    console.log('📈 Final Progress:', {
      completedDays: this.completedDays,
      totalDays: this.totalDays,
      progressPercent: this.progressPercent + '%',
    });

    this.showCongratulations = this.progressPercent === 100;

    if (this.showCongratulations && !this.userInfo.hasReviewedDiet) {
      console.log('🎉 100% completed. Redirecting to review page...');
      this.router.navigate(['/my-review'], {
        queryParams: { email: this.userEmail },
      });
    }
  }

  promptForReview(): void {
    const review = prompt(
      '🎯 Please write a quick review of your diet plan experience:'
    );
    if (!review || review.trim().length < 5) {
      this.toastr.info('Review skipped or too short.', 'ℹ️');
      return;
    }

    const weightStr = prompt('⚖️ What is your current weight now (kg)?');
    const updatedWeight = parseFloat(weightStr || '');
    if (isNaN(updatedWeight) || updatedWeight <= 0) {
      this.toastr.warning('Invalid weight input. Skipped weight update.', '⚠️');
    }

    const details = prompt(
      '📝 Any other health progress or feedback you want to log?'
    );

    const updatePayload: any = {
      email: this.userEmail,
      review,
    };

    if (!isNaN(updatedWeight)) updatePayload.weight = updatedWeight;
    if (details) updatePayload.details = details;

    this.http
      .patch(`http://localhost:3000/api/user/update-after-diet`, updatePayload)
      .subscribe({
        next: () =>
          this.toastr.success(
            '✅ Your review and progress were saved!',
            'Thank You'
          ),
        error: () =>
          this.toastr.error('❌ Failed to update your progress.', 'Error'),
      });
  }

  downloadExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Diet Plan');

    const headerRow = worksheet.addRow([
      'Week',
      'Day',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snack',
      'Finished',
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6347' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    for (
      let weekIndex = 0;
      weekIndex < this.generatedPlans.length;
      weekIndex++
    ) {
      const week = this.generatedPlans[weekIndex];
      for (let dayIndex = 0; dayIndex < week.days.length; dayIndex++) {
        const day = week.days[dayIndex];
        const row = worksheet.addRow([
          weekIndex + 1,
          dayIndex + 1,
          day.breakfast,
          day.lunch,
          day.dinner,
          day.snack || '',
          day.finished ? 'Yes' : 'No',
        ]);

        const finishedCell = row.getCell(7);
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
          if (length > maxLength) {
            maxLength = length;
          }
        }
      });
      column.width = maxLength + 5;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'diet-plan-styled.xlsx');
    });
  }
}
