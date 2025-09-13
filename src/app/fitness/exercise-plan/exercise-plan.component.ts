import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exercise-plan',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './exercise-plan.component.html',
  styleUrls: ['./exercise-plan.component.css'],
})
export class ExercisePlanComponent implements OnInit {
  userEmail: string = localStorage.getItem('userEmail') || '';
  userInfo: any = {};
  bmiValue = 0;
  userGoal = '';
  generating = false;

  // buckets expected by backend/DB
  exerciseRestrictions: string[] = [
    'noLegs',
    'noBack',
    'noPush',
    'noPull',
    'noWeights',
  ];

  // single selection
  selectedRestriction: string = 'default'; // 'default' means no restriction

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.userEmail) return;

    this.http
      .get<any>(`http://localhost:3000/api/user/${this.userEmail}`)
      .subscribe({
        next: (user) => {
          this.userInfo = user;
          this.userGoal = this.recommendGoal(
            user?.weight,
            user?.height,
            user?.age
          );

          // preload last choice if you store it (either as string or first of array)
          const saved =
            (user &&
              typeof user.exerciseRestrictions?.[0] === 'string' &&
              user.exerciseRestrictions[0]) ||
            (user &&
              typeof user.exerciseRestriction === 'string' &&
              user.exerciseRestriction) ||
            'default';
          this.selectedRestriction = saved;
        },
        error: () => console.warn('⚠️ Failed to load user info for BMI.'),
      });
  }

  recommendGoal(weight?: number, heightCm?: number, age?: number): string {
    if (!weight || !heightCm) return 'balance';
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    this.bmiValue = +bmi.toFixed(1);

    if ((age ?? 0) < 18) {
      if (bmi < 18.5) return 'gain';
      if (bmi < 25) return 'balance';
      return 'loss';
    }
    if ((age ?? 0) >= 65) {
      if (bmi < 22) return 'gain';
      if (bmi < 27) return 'balance';
      return 'loss';
    }
    if (bmi < 18.5) return 'gain';
    if (bmi < 25) return 'balance';
    return 'loss';
  }

  /** Radio/checkbox handler — enforce single selection */
  onRestrictionChange(restriction: string, checked: boolean): void {
    this.selectedRestriction = checked ? restriction : 'default';
  }

  isSelected(restriction: string): boolean {
    return this.selectedRestriction === restriction;
  }

  generatePlan(): void {
    if (!this.userEmail) {
      this.toastr.error('❌ Missing user email. Please log in again.', 'Error');
      return;
    }
    if (!this.userGoal) {
      this.toastr.error('❌ Please choose a goal.', 'Error');
      return;
    }

    this.generating = true;

    const payload = {
      email: this.userEmail,
      goal: this.userGoal,
      restriction: this.selectedRestriction || 'default', // SINGLE value
    };

    this.http
      .post(`http://localhost:3000/api/exercise/generate`, payload)
      .subscribe({
        next: () => {
          this.toastr.success('✅ Exercise plan generated!');
          setTimeout(() => {
            this.generating = false;
            this.router.navigate(['/fitness']);
          }, 2000);
        },
        error: () => {
          this.generating = false;
          this.toastr.error('❌ Failed to generate plan', 'Error');
        },
      });
  }
}
