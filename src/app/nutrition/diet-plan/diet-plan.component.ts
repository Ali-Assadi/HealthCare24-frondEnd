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
  plan: {
    goal: string;
    email: string;
    weeks: WeekPlan[];
  };
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
  userEmail: string = '';
  userGoal: string = '';
  bmiValue: number = 0;

  restrictions: { [key: string]: boolean } = {
    egg: false,
    milk: false,
    meat: false,
    fish: false,
    gluten: false,
    vegetarian: false,
  };

  getRestriction(key: string): boolean {
    return this.restrictions[key as keyof typeof this.restrictions];
  }

  setRestriction(key: string, value: boolean): void {
    this.restrictions[key as keyof typeof this.restrictions] = value;
  }

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

        if (Array.isArray(user.dietRestrictions)) {
          user.dietRestrictions.forEach((key: string) => {
            if (key in this.restrictions) {
              this.restrictions[key] = true;
            }
          });
        }
      },
      error: () => console.error('Failed to load user'),
    });
  }

  recommendGoal(weight: number, heightCm: number, age: number): string {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    this.bmiValue = +bmi.toFixed(1);

    // 🚸 Special case: young AND underweight
    if (age < 18) {
      if (bmi < 18.5) return 'gain';
      if (bmi >= 18.5 && bmi < 25) return 'balance';
      return 'loss';
    }
    if (age >= 65) {
      if (bmi < 22) return 'gain';
      if (bmi >= 22 && bmi < 27) return 'balance';
      return 'loss';
    }
    if (bmi < 18.5) return 'gain';
    if (bmi >= 18.5 && bmi < 25) return 'balance';
    return 'loss';
  }

  generatePlan(): void {
    if (!this.userEmail) {
      this.toastr.error('❌ Missing user email. Please log in again.', 'Error');
      return;
    }

    this.loading = true;

    const selectedRestrictions = Object.entries(this.restrictions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const payload = {
      email: this.userEmail,
      goal: this.userGoal,
      restrictions: selectedRestrictions,
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

          // ⏳ Show spinner for 2 seconds before redirect
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
