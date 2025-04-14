import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-exercise-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-exercise-plan.component.html',
  styleUrls: ['./my-exercise-plan.component.css'],
})
export class MyExercisePlanComponent implements OnInit {
  exercisePlan: any[] = [];
  goal: string = '';
  loading = true;
  userEmail = localStorage.getItem('userEmail') || '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/exercise/plan/${this.userEmail}`).subscribe({
      next: (data) => {
        this.exercisePlan = data.exercisePlan || [];
        this.goal = data.goal;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load exercise plan');
        this.loading = false;
      },
    });
  }
}
