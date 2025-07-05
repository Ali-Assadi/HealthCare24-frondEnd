import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.css'],
})
export class MyReviewsComponent implements OnInit {
  userEmail: string = '';
  dietReviews: any[] = [];
  exerciseReviews: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    if (!this.userEmail) {
      this.error = 'No user email found.';
      this.loading = false;
      return;
    }

    this.fetchReviews();
  }

  fetchReviews() {
    this.http
      .get<any>(`http://localhost:3000/api/user/${this.userEmail}/reviews`)
      .subscribe({
        next: (res) => {
          this.dietReviews = res.dietReviews || [];
          this.exerciseReviews = res.exerciseReviews || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load reviews. Please try again later.';
          this.toastr.error(this.error);
          this.loading = false;
        },
      });
  }
}
