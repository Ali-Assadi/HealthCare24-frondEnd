import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DayPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack?: string;
  finished?: boolean;
}
interface WeekPlan {
  days: DayPlan[];
}
interface DietPlanResponse {
  message: string;
  plan: { goal: string; email: string; weeks: WeekPlan[] };
}

type RestrictionKey =
  | 'egg'
  | 'milk'
  | 'meat'
  | 'fish'
  | 'gluten'
  | 'vegetarian';

@Component({
  selector: 'app-diet-plan',
  templateUrl: './diet-plan.component.html',
  styleUrls: ['./diet-plan.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DietPlanComponent implements OnInit {
  userInfo: any = {};
  userEmail = '';
  userGoal = '';
  bmiValue = 0;

  // one-of list for the UI
  restrictionKeys: RestrictionKey[] = [
    'egg',
    'milk',
    'meat',
    'fish',
    'gluten',
    'vegetarian',
  ];
  selectedRestriction: string = 'default'; // 'default' = no restriction

  generatedPlans: WeekPlan[] = [];
  loading = false;
  showPlan = false;

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
        this.userGoal = this.recommendGoal(user.weight, user.height, user.age);

        // preload single restriction if present; else fall back to first legacy entry
        if (
          typeof user.dietRestriction === 'string' &&
          user.dietRestriction.trim()
        ) {
          this.selectedRestriction = user.dietRestriction.trim();
        } else if (
          Array.isArray(user.dietRestrictions) &&
          user.dietRestrictions.length
        ) {
          this.selectedRestriction =
            String(user.dietRestrictions[0]).trim() || 'default';
        }
      },
      error: () => console.error('Failed to load user'),
    });
  }

  recommendGoal(weight: number, heightCm: number, age: number): string {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    this.bmiValue = +bmi.toFixed(1);

    if (age < 18) {
      if (bmi < 18.5) return 'gain';
      if (bmi < 25) return 'balance';
      return 'loss';
    }
    if (age >= 65) {
      if (bmi < 22) return 'gain';
      if (bmi < 27) return 'balance';
      return 'loss';
    }
    if (bmi < 18.5) return 'gain';
    if (bmi < 25) return 'balance';
    return 'loss';
  }

  // if you keep checkboxes, call this on change to enforce single selection
  onRestrictionChange(key: string, checked: boolean): void {
    this.selectedRestriction = checked ? key : 'default';
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

    this.loading = true;

    const payload = {
      email: this.userEmail,
      goal: this.userGoal,
      restriction: this.selectedRestriction || 'default', // SINGLE value
    };

    console.log('🚀 Sending diet plan request with:', payload);

    this.http
      .post<DietPlanResponse>(
        'http://localhost:3000/api/dietplan/generate-diet-plan',
        payload
      )
      .subscribe({
        next: (response) => {
          this.generatedPlans = response.plan.weeks;
          this.toastr.success(
            '✅ Diet plan generated successfully!',
            'Success'
          );
          this.showPlan = true;

          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/nutrition']);
          }, 2000);
        },
        error: () => {
          this.toastr.error('❌ Failed to generate diet plan.', 'Error');
          this.loading = false;
        },
      });
  }
}
