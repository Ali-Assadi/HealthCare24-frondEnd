import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-plan',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './exercise-plan.component.html',
  styleUrls: ['./exercise-plan.component.css'],
})
export class ExercisePlanComponent {
  goal = '';
  generating = false;
  userEmail = localStorage.getItem('userEmail') || '';
  userInfo: any = {};
  bmiValue: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    if (!this.userEmail) return;

    this.http
      .get<any>(`http://localhost:3000/api/user/${this.userEmail}`)
      .subscribe({
        next: (user) => {
          this.userInfo = user;

          if (user.height && user.weight) {
            const heightM = user.height / 100;
            const bmi = user.weight / (heightM * heightM);
            this.bmiValue = +bmi.toFixed(1);

            // Recommend based on BMI
            if (bmi < 18.5) this.goal = 'mass';
            else if (bmi >= 18.5 && bmi < 25) this.goal = 'balance';
            else this.goal = 'loss';
          }
        },
        error: () => console.warn('⚠️ Failed to load user info for BMI.'),
      });
  }

  generatePlan() {
    if (!this.goal) return;
    this.generating = true;

    this.http
      .post(`http://localhost:3000/api/exercise/generate`, {
        email: this.userEmail,
        goal: this.goal,
      })
      .subscribe({
        next: () => {
          setTimeout(() => {
            window.location.href = '/fitness';
          }, 3000);
        },
        error: () => {
          this.generating = false;
          alert('❌ Failed to generate plan');
        },
      });
  }
}
