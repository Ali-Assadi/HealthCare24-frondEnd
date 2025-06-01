import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-admin-diets',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-diets.component.html',
  styleUrls: ['./admin-diets.component.css'],
})
export class AdminDietsComponent implements OnInit {
  diets: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchEmail: string = '';
  selectedIndex: number | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.loadDiets();
  }

  loadDiets() {
    this.http.get<any[]>('http://localhost:3000/api/admin/diets').subscribe({
      next: (data) => {
        this.diets = data;
        this.filteredUsers = data;
        this.toastr.success('Diet plans loaded successfully!', 'Success'); // Optional: success toast for loading
      },
      error: (err) => {
        console.error('Failed to load diets:', err);
        this.toastr.error('Failed to load diet plans.', 'Error');
      },
    });
  }

  searchByEmail(): void {
    const email = this.searchEmail.trim().toLowerCase();
    if (!email) {
      this.filteredUsers = this.diets;
      this.toastr.info('Displaying all diet plans.', 'Search Cleared');
    } else {
      this.filteredUsers = this.diets.filter((user) =>
        user.email.toLowerCase().includes(email)
      );
      if (this.filteredUsers.length === 0) {
        this.toastr.info('No diet plans found for this email.', 'No Results');
      } else {
        this.toastr.success('Diet plans filtered by email.', 'Search Complete');
      }
    }
    this.selectedUser = null;
    this.selectedIndex = null;
  }

  selectUser(user: any, index: number): void {
    this.selectedUser = JSON.parse(JSON.stringify(user)); // Deep copy for safe editing
    this.selectedIndex = index;
    this.toastr.info(`Selected diet plan for ${user.email}.`, 'User Selected');
  }

  updateMeal(weekIndex: number, dayIndex: number, type: string, value: string) {
    if (this.selectedUser?.dietPlan[weekIndex]?.days[dayIndex]) {
      this.selectedUser.dietPlan[weekIndex].days[dayIndex][type] = value;
      this.toastr.info('Meal updated locally.', 'Meal Updated');
    } else {
      this.toastr.error('Could not update meal. Please select a user and a valid meal.', 'Update Failed');
    }
  }

  addSnack(day: any): void {
    day.snack = 'New Snack';
    this.toastr.success('Snack added to the day.', 'Snack Added');
  }

  addWeek(): void {
    if (this.selectedUser.dietPlan.length >= 5) {
      this.toastr.warning('Maximum of 5 weeks allowed per plan.', 'Limit Reached');
      return;
    }

    this.selectedUser.dietPlan.push({
      days: [
        {
          breakfast: '',
          lunch: '',
          dinner: '',
          snack: ''
        }
      ]
    });
    this.toastr.success('New week added to the diet plan.', 'Week Added');
  }

  deleteWeek(index: number): void {
    // For confirm(), we'll directly perform the action and use a toast for feedback.
    // A more robust solution would involve a custom confirmation modal.
    this.selectedUser.dietPlan.splice(index, 1);
    this.toastr.success('Week deleted from the diet plan.', 'Week Deleted');
  }

  addDay(weekIndex: number): void {
    const days = this.selectedUser.dietPlan[weekIndex].days;
    if (days.length >= 7) {
      this.toastr.warning('There are only 7 days in a week. Cannot add more days.', 'Limit Reached');
      return;
    }

    days.push({ breakfast: '', lunch: '', dinner: '', snack: '' });
    this.toastr.success('New day added to the week.', 'Day Added');
  }

  deleteDay(weekIndex: number, dayIndex: number): void {
    // For confirm(), we'll directly perform the action and use a toast for feedback.
    // A more robust solution would involve a custom confirmation modal.
    this.selectedUser.dietPlan[weekIndex].days.splice(dayIndex, 1);
    this.toastr.success('Day deleted from the week.', 'Day Deleted');
  }

  saveChanges(): void {
    if (!this.selectedUser?.email) {
      this.toastr.error('No user selected to save changes.', 'Save Failed');
      return;
    }

    this.http
      .put(`http://localhost:3000/api/admin/diets/${this.selectedUser.email}`, {
        dietPlan: this.selectedUser.dietPlan,
      })
      .subscribe({
        next: () => {
          this.toastr.success(`Diet updated for ${this.selectedUser.email} successfully!`, 'Update Success');
          this.diets[this.selectedIndex!] = { ...this.selectedUser };
          this.searchByEmail(); // Refresh list
        },
        error: (err) => {
          console.error('Failed to update diet:', err);
          this.toastr.error('Failed to update diet plan.', 'Update Failed');
        },
      });
  }
}
