import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-diet-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-diet-plan.component.html',
  styleUrls: ['./my-diet-plan.component.css']
})
export class MyDietPlanComponent implements OnInit {
  userInfo: any = {};
  userGoal = '';
  generatedPlans: any[] = [];
  showAllWeeks: boolean = false;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.userGoal = user.goal || '';
        this.generatedPlans = user.dietPlan || [];
      },
      error: () => console.error('❌ Failed to fetch user plan.')
    });
  }
}
