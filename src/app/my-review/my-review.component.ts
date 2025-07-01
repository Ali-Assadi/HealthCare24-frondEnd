import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.css'],
  imports: [FormsModule],
})
export class MyReviewComponent implements OnInit {
  userEmail = '';
  review = '';
  weight: number = 0;
  details = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.userEmail = email;

    this.http
      .get<any>(`http://localhost:3000/api/user/${email}`)
      .subscribe((user) => {
        this.weight = user.weight || 0;
        this.details = user.details || '';
      });
  }

  submitReview(): void {
    if (!this.review.trim()) {
      this.toastr.warning('Please enter a valid review.');
      return;
    }

    if (this.weight <= 0 || isNaN(this.weight)) {
      this.toastr.warning('Please enter a valid weight.');
      return;
    }

    this.http
      .patch(`http://localhost:3000/api/user/update-after-diet`, {
        email: this.userEmail,
        review: this.review,
        weight: this.weight,
        details: this.details,
      })
      .subscribe({
        next: () => {
          this.toastr.success('🎉 Review submitted!');
          this.router.navigate(['/my-dietPlan']);
        },
        error: () => this.toastr.error('❌ Failed to submit review'),
      });
  }
}
