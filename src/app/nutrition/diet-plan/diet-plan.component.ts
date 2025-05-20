import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DayPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack?: string;
  finished?: boolean; // ✅ Add finished property
}

interface WeekPlan {
  days: DayPlan[];
}

@Component({
  selector: 'app-diet-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diet-plan.component.html',
  styleUrls: ['./diet-plan.component.css']
})
export class DietPlanComponent implements OnInit {
  userInfo: any = {};
  userGoal: string = '';
  generatedPlans: WeekPlan[] = [];
  showPlan = false;
  loading = false;
  hideGoalSelector = false;
  userEmail: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.userEmail = email;

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;
        if (user.dietPlan?.length) {
          this.generatedPlans = user.dietPlan;
          this.userGoal = user.goal;
          this.showPlan = true;
          this.hideGoalSelector = true;
        }
      },
      error: () => console.error('Failed to load user')
    });
  }

  generatePlan(): void {
    this.loading = true;
    this.showPlan = false;

    this.http.get<any>(`http://localhost:3000/api/diet-plan/${this.userGoal}`).subscribe({
      next: (plan) => {
        // ✅ ADD "finished: false" to every day
        const planWithFinished = plan.weeks.map((week: any) => ({
          days: week.days.map((day: any) => ({
            ...day,
            finished: false
          }))
        }));

        this.http.put(`http://localhost:3000/api/user/${this.userInfo.email}/diet`, {
          goal: this.userGoal,
          plan: planWithFinished
        }).subscribe({
          next: () => {
            setTimeout(() => {
              this.generatedPlans = planWithFinished;
              this.loading = false;
              this.showPlan = true;
              this.hideGoalSelector = true;
              this.router.navigateByUrl('/').then(() => {
                this.router.navigate(['/nutrition']);
              });
            }, 1000); // faster generation, not 10 seconds!
          },
          error: () => {
            this.loading = false;
            alert('❌ Failed to save diet plan to user.');
          }
        });
      },
      error: () => {
        this.loading = false;
        alert('❌ Failed to fetch diet plan from server.');
      }
    });
  }
}
