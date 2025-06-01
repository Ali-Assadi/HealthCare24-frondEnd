import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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

@Component({
  selector: 'app-diet-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diet-plan.component.html',
  styleUrls: ['./diet-plan.component.css'],
})
export class DietPlanComponent implements OnInit {
  userInfo: any = {};
  userGoal: string = '';
  generatedPlans: WeekPlan[] = [];
  showPlan = false;
  loading = false;
  hideGoalSelector = false;
  userEmail: string = '';
  bmiValue: number = 0;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('Please log in to view or generate your diet plan.', 'Login Required');
      return;
    }

    this.userEmail = email;

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;

        if (user.dietPlan?.length) {
          this.generatedPlans = user.dietPlan;
          this.userGoal = user.goal;
          this.showPlan = true;
          this.hideGoalSelector = true;
          this.toastr.success('Your existing diet plan loaded successfully!', 'Plan Loaded');
        } else {
          this.userGoal = this.recommendGoal(user.weight, user.height);
          this.toastr.info('No existing plan found. A goal has been recommended based on your BMI.', 'Generate Plan');
        }
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.toastr.error('Failed to load user information.', 'Error');
      },
    });
  }

  recommendGoal(weight: number, heightCm: number): string {
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    this.bmiValue = +bmi.toFixed(1);

    if (bmi < 18.5) return 'gain';
    if (bmi >= 18.5 && bmi < 25) return 'balance';
    return 'loss';
  }

  generatePlan(): void {
    if (!this.userGoal) {
      this.toastr.warning('Please select a goal before generating a plan.', 'Goal Required');
      return;
    }

    this.loading = true;
    this.showPlan = false;
    this.toastr.info('Generating your diet plan...', 'Please Wait');

    this.http
      .get<any>(`http://localhost:3000/api/diet-plan/${this.userGoal}`)
      .subscribe({
        next: (plan) => {
          // Add "finished: false" to every day
          const planWithFinished = plan.weeks.map((week: any) => ({
            days: week.days.map((day: any) => ({
              ...day,
              finished: false,
            })),
          }));

          this.http
            .put(`http://localhost:3000/api/user/${this.userInfo.email}/diet`, {
              goal: this.userGoal,
              plan: planWithFinished,
            })
            .subscribe({
              next: () => {
                this.toastr.success('Diet plan generated and saved!', 'Plan Saved');
                setTimeout(() => {
                  this.generatedPlans = planWithFinished;
                  this.loading = false;
                  this.showPlan = true;
                  this.hideGoalSelector = true;
                  // Navigate to '/' then to '/nutrition' to ensure full component re-initialization if needed,
                  // or simply navigate to '/nutrition' if the component handles updates well.
                  // For a fresh state, navigating away and back can be useful.
                  this.router.navigateByUrl('/').then(() => {
                    this.router.navigate(['/nutrition']);
                  });
                }, 3000); // Wait for 3 seconds to show toast
              },
              error: (err) => {
                this.loading = false;
                console.error('❌ Failed to save diet plan to user:', err);
                this.toastr.error('Failed to save diet plan to your profile.', 'Save Failed');
              },
            });
        },
        error: (err) => {
          this.loading = false;
          console.error('❌ Failed to fetch diet plan from server:', err);
          this.toastr.error('Failed to fetch diet plan from server. Please try again.', 'Generation Failed');
        },
      });
  }
}
