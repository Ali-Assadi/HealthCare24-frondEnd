import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-my-exercise-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-exercise-plan.component.html',
  styleUrls: ['./my-exercise-plan.component.css'],
})
export class MyExercisePlanComponent implements OnInit {
  exercisePlan: any[] = [];
  goal: string = '';
  loading = true;
  userEmail = localStorage.getItem('userEmail') || '';

  completedDays = 0;
  totalDays = 0;
  progressPercent = 0;
  showCongratulations = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    if (!this.userEmail) {
      this.toastr.warning('Please log in to view your exercise plan.', 'Login Required');
      this.loading = false;
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/exercise/plan/${this.userEmail}`).subscribe({
      next: (data) => {
        this.exercisePlan = data.exercisePlan || [];
        this.goal = data.goal;
        this.addFinishedFieldIfMissing();
        this.calculateProgress();
        this.loading = false;
        this.toastr.success('Exercise plan loaded successfully!', 'Plan Loaded');
      },
      error: (err) => {
        console.error('Failed to load exercise plan:', err);
        this.toastr.error('Failed to load exercise plan.', 'Error');
        this.loading = false;
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
    // Only mark if not already finished
    if (!this.exercisePlan[weekIndex].days[dayIndex].finished) {
      this.exercisePlan[weekIndex].days[dayIndex].finished = true;
      this.calculateProgress();

      this.http.patch('http://localhost:3000/api/exercise/update-finished-exercise-day', {
        email: this.userEmail,
        weekIndex,
        dayIndex
      }).subscribe({
        next: () => {
          console.log('✅ Exercise day marked as finished in DB!');
          this.toastr.success('Day marked as finished!', 'Progress Updated');
        },
        error: (err) => {
          console.error('❌ Failed to update exercise day in DB', err);
          this.toastr.error('Failed to mark day as finished in database.', 'Update Failed');
          // Revert local change if DB update fails
          this.exercisePlan[weekIndex].days[dayIndex].finished = false;
          this.calculateProgress();
        }
      });
    } else {
      this.toastr.info('This day is already marked as finished.', 'Already Finished');
    }
  }

  restartPlan(): void {
    // Replaced confirm() with direct action and toast feedback.
    // For critical operations, consider a custom confirmation modal.
    this.toastr.info('Resetting your exercise plan...', 'Restarting Plan');

    for (let week of this.exercisePlan) {
      for (let day of week.days) {
        day.finished = false;
      }
    }
    this.calculateProgress();

    this.http.patch('http://localhost:3000/api/exercise/reset-finished-exercise', {
      email: this.userEmail
    }).subscribe({
      next: () => {
        this.toastr.success('Exercise plan has been reset!', 'Plan Reset');
      },
      error: (err) => {
        console.error('❌ Failed to reset exercise plan:', err);
        this.toastr.error('Failed to reset exercise plan.', 'Error');
      }
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
    this.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Show congratulations only if progress becomes 100% and it wasn't already
    if (this.progressPercent === 100 && !this.showCongratulations) {
      this.toastr.success('Congratulations! You have completed your exercise plan!', 'Plan Completed!');
    }
    this.showCongratulations = this.progressPercent === 100;
  }

  downloadExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exercise Plan');

    // Add Header Row
    const headerRow = worksheet.addRow(['Week', 'Day', 'Type', 'Workout', 'Finished']);

    // Style Header Row
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '6c5ce7' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    // Add Data Rows
    for (let week of this.exercisePlan) {
      for (let day of week.days) {
        const row = worksheet.addRow([
          week.week,
          day.day,
          day.type,
          day.workout,
          day.finished ? 'Yes' : 'No'
        ]);

        // Style Finished Cell
        const finishedCell = row.getCell(5);
        finishedCell.font = {
          color: { argb: day.finished ? '00C853' : 'D50000' } // Green for Yes, Red for No
        };
        finishedCell.alignment = { horizontal: 'center' };
      }
    }

    // ✅ Correct Auto Width - FIX for TypeScript error
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

    // Save file
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'exercise-plan-styled.xlsx');
      this.toastr.success('Exercise plan downloaded as Excel!', 'Download Complete');
    }).catch(err => {
      console.error('Failed to download Excel:', err);
      this.toastr.error('Failed to download exercise plan as Excel.', 'Download Failed');
    });
  }
}
