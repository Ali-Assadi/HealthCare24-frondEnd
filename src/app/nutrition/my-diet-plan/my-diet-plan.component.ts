import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

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

  userInfo: any = {};
  userGoal = '';
  generatedPlans: any[] = [];
  showAllWeeks: boolean = false;
  userEmail: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.userEmail = email;
    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.userGoal = user.goal || '';
        this.generatedPlans = user.dietPlan || [];
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

  calculateProgress(): void {
    let completed = 0;
    let total = 0;

    for (let week of this.generatedPlans) {
      for (let day of week.days) {
        total++;
        if (day.finished) {
          completed++;
        }
      }
    }

    this.completedDays = completed;
    this.totalDays = total;
    this.progressPercent =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    this.showCongratulations = this.progressPercent === 100;
  }

  downloadExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Diet Plan');

    // Add Header Row
    const headerRow = worksheet.addRow([
      'Week',
      'Day',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snack',
      'Finished',
    ]);

    // Style Header
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6347' }, // 🧡 Orange nutrition color
      };
      cell.alignment = { horizontal: 'center' };
    });

    // Add Data Rows
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

        // Style Finished cell color
        const finishedCell = row.getCell(7);
        finishedCell.font = {
          color: { argb: day.finished ? '00C853' : 'D50000' }, // Green for Yes, Red for No
        };
        finishedCell.alignment = { horizontal: 'center' };
      }
    }

    // Auto Width Columns
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

    // Save
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'diet-plan-styled.xlsx');
    });
  }
}
