import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-exercise-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-exercise-plan.component.html',
  styleUrls: ['./my-exercise-plan.component.css'],
})
export class MyExercisePlanComponent implements OnInit {
  exercisePlan: any[] = [];
  goal: string = '';
  loading = true;
  userEmail = localStorage.getItem('userEmail') || '';
  updatedWeight: number | null = null;
  updatedDetails: string = '';
  review: string = '';
  reviewSubmitted = false;
  completedDays = 0;
  totalDays = 0;
  progressPercent = 0;
  showCongratulations = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.http
      .get<any>(`http://localhost:3000/api/exercise/plan/${this.userEmail}`)
      .subscribe({
        next: (data) => {
          this.exercisePlan = data.exercisePlan || [];
          this.goal = data.goal;
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
      review: this.review,
    };

    this.http
      .post('http://localhost:3000/api/exercise/submit-review', payload)
      .subscribe({
        next: () => {
          this.toastr.success('✅ Thank you for your feedback!');
          this.reviewSubmitted = true;
        },
        error: () => {
          this.toastr.error('❌ Failed to submit feedback');
        },
      });
  }

  addFinishedFieldIfMissing(): void {
    for (let week of this.exercisePlan) {
      for (let day of week.days) {
        if (day.finished === undefined) {
          day.finished = false;
        }
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
        next: () => {
          console.log('✅ Exercise day marked as finished in DB!');
        },
        error: (err) => {
          console.error('❌ Failed to update exercise day in DB', err);
        },
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

    for (let week of this.exercisePlan) {
      for (let day of week.days) {
        day.finished = false;
      }
    }
    this.calculateProgress();

    this.http
      .patch('http://localhost:3000/api/exercise/reset-finished-exercise', {
        email: this.userEmail,
      })
      .subscribe({
        next: () => {
          this.toastr.success('✅ Exercise plan has been reset!');
        },
        error: () => {
          this.toastr.error('❌ Failed to reset exercise plan');
        },
      });
  }

  calculateProgress(): void {
    let completed = 0;
    let total = 0;

    for (let week of this.exercisePlan) {
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

    for (let week of this.exercisePlan) {
      for (let day of week.days) {
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
      saveAs(blob, 'exercise-plan-styled.xlsx');
    });
  }
}
