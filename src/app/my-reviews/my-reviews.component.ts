import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reviews.component.html',
  styleUrl: './my-reviews.component.css',
})
export class MyReviewsComponent implements OnInit {
  reviews: any[] = [];
  email: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || localStorage.getItem('userEmail') || '';
      if (this.email) {
        this.http
          .get<any>(`http://localhost:3000/api/user/${this.email}`)
          .subscribe({
            next: (user) => {
              this.reviews = user.reviews || [];
            },
            error: () => alert('Failed to load reviews'),
          });
      }
    });
  }
  goToProfile() {
    window.location.href = '/profile';
  }
}
