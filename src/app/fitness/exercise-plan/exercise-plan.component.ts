import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-exercise-plan',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './exercise-plan.component.html',
  styleUrls: ['./exercise-plan.component.css'],
})
export class ExercisePlanComponent implements OnInit { // Added OnInit to implement ngOnInit lifecycle hook
  goal = '';
  generating = false;
  userEmail = localStorage.getItem('userEmail') || '';
  userInfo: any = {};
  bmiValue: number = 0;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    if (!this.userEmail) {
      this.toastr.warning('Please log in to view or generate an exercise plan.', 'Login Required');
      return;
    }

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

            this.toastr.info(`Your BMI is ${this.bmiValue}. Recommended goal: ${this.goal}.`, 'BMI Calculated');
          } else {
            this.toastr.info('Please update your height and weight in your profile to get a BMI-based recommendation.', 'Profile Incomplete');
          }
        },
        error: (err) => {
          console.warn('⚠️ Failed to load user info for BMI:', err);
          this.toastr.error('Failed to load user information for BMI calculation.', 'User Info Error');
        },
      });
  }

  generatePlan() {
    if (!this.goal) {
      this.toastr.warning('Please select a goal before generating a plan.', 'Goal Required');
      return;
    }
    this.generating = true;
    this.toastr.info('Generating your exercise plan...', 'Please Wait');

    this.http
      .post(`http://localhost:3000/api/exercise/generate`, {
        email: this.userEmail,
        goal: this.goal,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Your exercise plan has been generated!', 'Plan Generated');
          setTimeout(() => {
            window.location.href = '/fitness'; // Redirect after a short delay
          }, 3000); // Wait for 3 seconds to show toast
        },
        error: (err) => {
          this.generating = false;
          console.error('❌ Failed to generate plan:', err);
          this.toastr.error('Failed to generate exercise plan. Please try again.', 'Generation Failed');
        },
      });
  }
}
