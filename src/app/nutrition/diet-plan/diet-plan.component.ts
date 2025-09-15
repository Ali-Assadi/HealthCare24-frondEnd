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

  // one-of list for the UI (handy if you prefer *ngFor="let key of restrictionKeys")
  restrictionKeys: RestrictionKey[] = [
    'egg',
    'milk',
    'meat',
    'fish',
    'gluten',
    'vegetarian',
  ];

  // single value sent to backend; 'default' = no restriction
  selectedRestriction: string = 'default';

  // checkbox UI state (keeps your styles; only one true at a time)
  restrictions: Record<RestrictionKey, boolean> = {
    egg: false,
    milk: false,
    meat: false,
    fish: false,
    gluten: false,
    vegetarian: false,
  };

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

        // preload single restriction if present; else fall back to first legacy entry; else default
        let preload = 'default';
        if (
          typeof user.dietRestriction === 'string' &&
          user.dietRestriction.trim()
        ) {
          preload = user.dietRestriction.trim();
        } else if (
          Array.isArray(user.dietRestrictions) &&
          user.dietRestrictions.length
        ) {
          preload = String(user.dietRestrictions[0]).trim() || 'default';
        }
        this.setOnly(preload as RestrictionKey | 'default');
      },
      error: () => console.error('Failed to load user'),
    });
  }

  recommendGoal(weight: number, heightCm: number, age: number): string {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    this.bmiValue = +bmi.toFixed(1);

    if (age < 18) return bmi < 18.5 ? 'gain' : bmi < 25 ? 'balance' : 'loss';
    if (age >= 65) return bmi < 22 ? 'gain' : bmi < 27 ? 'balance' : 'loss';
    return bmi < 18.5 ? 'gain' : bmi < 25 ? 'balance' : 'loss';
  }

  /** Checkbox change handler (works with either *ngFor over keys or | keyvalue) */
  onRestrictionChange(key: RestrictionKey, event: Event): void {
    const checked = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.setOnly(checked ? key : 'default');
  }

  /** If your template uses (change)="onRestrictionToggle(key, $event.target.checked)" use this alias */
  onRestrictionToggle(key: RestrictionKey, checked: boolean): void {
    this.setOnly(checked ? key : 'default');
  }

  /** Utility: set exactly one option true, update selectedRestriction */
  private setOnly(key: RestrictionKey | 'default'): void {
    (Object.keys(this.restrictions) as RestrictionKey[]).forEach(
      (k) => (this.restrictions[k] = false)
    );
    if (key !== 'default') this.restrictions[key] = true;
    this.selectedRestriction = key; // 'default' or one of RestrictionKey
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
