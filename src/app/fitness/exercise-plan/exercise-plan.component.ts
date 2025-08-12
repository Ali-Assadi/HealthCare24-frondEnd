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
  bmiValue: number = 0;
  userGoal: string = '';
  generating = false;

  exerciseRestrictions: string[] = [
    'noLegs',
    'noBack',
    'noPush',
    'noPull',
    'noWeights',
  ];

  selectedRestrictions: string[] = [];

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
            user.weight,
            user.height,
            user.age
          );
        },
        error: () => console.warn('⚠️ Failed to load user info for BMI.'),
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

  toggleRestriction(restriction: string): void {
    const index = this.selectedRestrictions.indexOf(restriction);
    if (index > -1) this.selectedRestrictions.splice(index, 1);
    else this.selectedRestrictions.push(restriction);
  }

  isSelected(restriction: string): boolean {
    return this.selectedRestrictions.includes(restriction);
  }

  generatePlan(): void {
    if (!this.userGoal || !this.userEmail) return;

    this.generating = true;

    const selected = this.selectedRestrictions;

    const payload = {
      email: this.userEmail,
      goal: this.userGoal,
      restrictions: selected,
    };

    this.http
      .post(`http://localhost:3000/api/exercise/generate`, payload)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.toastr.success('✅ Exercise plan generated!');
            this.router.navigate(['/fitness']);
          }, 2000);
        },
        error: () => {
          this.generating = false;
          this.toastr.error('❌ Failed to generate plan', 'Error');
        },
      });
  }

  onRestrictionChange(r: string, checked: boolean): void {
    if (typeof (this as any).selectedRestrictions?.clear === 'function') {
      (this as any).selectedRestrictions.clear();
      if (checked) (this as any).selectedRestrictions.add(r);
    } else {
      (this as any).selectedRestrictions = checked ? [r] : [];
    }
  }
}
