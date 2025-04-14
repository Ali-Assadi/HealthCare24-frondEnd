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
  styleUrls: ['./exercise-plan.component.css']
})
export class ExercisePlanComponent {
  goal = '';
  generating = false;
  userEmail = localStorage.getItem('userEmail') || '';

  constructor(private http: HttpClient, private router: Router) {}

  generatePlan() {
    if (!this.goal) return;
    this.generating = true;

    this.http.post(`http://localhost:3000/api/exercise/generate`, {
      email: this.userEmail,
      goal: this.goal
    }).subscribe({
      next: () => {
        setTimeout(() => this.router.navigate(['/fitness']), 10000);
      },
      error: () => {
        this.generating = false;
        alert('Failed to generate plan');
      }
    });
  }
}
