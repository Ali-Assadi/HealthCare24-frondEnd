import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  email: string = '';
  showForm: boolean = false;

  age: number | null = null;
  height: number | null = null;
  weight: number | null = null;
  details: string = '';
  visaCard: any = null;
  private confirmedDelete = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem('userEmail') || '';

    if (this.email) {
      this.fetchUserDetails();
      this.fetchVisaCard();
    }
  }

  fetchUserDetails() {
    this.http
      .get<any>(`http://localhost:3000/api/user/${this.email}`)
      .subscribe({
        next: (user) => {
          this.age = user.age;
          this.height = user.height;
          this.weight = user.weight;
          this.details = user.details;
        },
        error: (err) => {
          console.error('Failed to load user', err);
          this.toastr.error('Failed to load user data.', '❌ Error');
        },
      });
  }

  fetchVisaCard() {
    this.http
      .get<any>(`http://localhost:3000/api/user/${this.email}/visa`)
      .subscribe({
        next: (res) => {
          if (res?.visaCard) {
            this.visaCard = res.visaCard;
          }
        },
        error: () => {
          this.visaCard = null;
        },
      });
  }

  deleteVisaCard() {
    if (!confirm('Are you sure you want to remove your Visa card?')) return;

    this.http
      .delete(`http://localhost:3000/api/user/${this.email}/visa`)
      .subscribe({
        next: () => {
          this.toastr.success('Visa card removed.', '✅ Removed');
          this.visaCard = null;
        },
        error: () => {
          this.toastr.error('Failed to remove Visa card.', '❌ Error');
        },
      });
  }

  submitUpdate() {
    const updatedData = {
      age: this.age,
      height: this.height,
      weight: this.weight,
      details: this.details,
    };

    this.http
      .put(`http://localhost:3000/api/user/${this.email}`, updatedData)
      .subscribe({
        next: () => {
          this.toastr.success('Your details have been updated.', '✅ Success');
          this.showForm = false;
        },
        error: () => {
          this.toastr.error('Failed to update your details.', '❌ Error');
        },
      });
  }

  deleteAccount() {
    if (!this.confirmedDelete) {
      this.toastr.warning(
        'Click "Delete Account" again to confirm.',
        '⚠️ Confirm Deletion',
        { timeOut: 3000 }
      );
      this.confirmedDelete = true;
      setTimeout(() => {
        this.confirmedDelete = false;
      }, 3000);
      return;
    }

    this.http.delete(`http://localhost:3000/api/user/${this.email}`).subscribe({
      next: () => {
        this.toastr.success('Your account has been deleted.', '🗑️ Deleted');
        localStorage.removeItem('userEmail');
        window.location.href = '/sign-in';
      },
      error: () => {
        this.toastr.error('Failed to delete your account.', '❌ Error');
      },
    });
  }

  goToReviews() {
    this.router.navigate(['/my-reviews'], {
      queryParams: { email: this.email },
    });
  }
}
