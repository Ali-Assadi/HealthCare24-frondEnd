import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css'],
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = true;
  error: string | null = null;
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/admin/all-reviews')
      .subscribe({
        next: (data) => {
          this.reviews = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load reviews.';
          this.loading = false;
        },
      });
  }
  get filteredReviews(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.reviews.filter((user) =>
      user.email.toLowerCase().includes(query)
    );
  }
}
