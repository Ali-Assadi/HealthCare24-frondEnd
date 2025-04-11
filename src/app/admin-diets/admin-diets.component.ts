import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-diets',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-diets.component.html',
  styleUrls: ['./admin-diets.component.css']
})
export class AdminDietsComponent implements OnInit {
  diets: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchEmail: string = '';
  selectedIndex: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDiets();
  }

  loadDiets() {
    this.http.get<any[]>('http://localhost:3000/api/admin/diets').subscribe({
      next: (data) => {
        this.diets = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error('Failed to load diets:', err),
    });
  }

  searchByEmail(): void {
    const email = this.searchEmail.trim().toLowerCase();
    if (!email) {
      this.filteredUsers = this.diets;
    } else {
      this.filteredUsers = this.diets.filter(user =>
        user.email.toLowerCase().includes(email)
      );
    }
    this.selectedUser = null;
    this.selectedIndex = null;
  }

  selectUser(user: any, index: number): void {
    this.selectedUser = JSON.parse(JSON.stringify(user)); // Deep copy for safe editing
    this.selectedIndex = index;
  }

  updateMeal(weekIndex: number, dayIndex: number, type: string, value: string) {
    if (this.selectedUser?.dietPlan[weekIndex]?.days[dayIndex]) {
      this.selectedUser.dietPlan[weekIndex].days[dayIndex][type] = value;
    }
  }

  addSnack(day: any): void {
    day.snack = 'New Snack';
  }

  saveChanges(): void {
    if (!this.selectedUser?.email) return;

    this.http
      .put(`http://localhost:3000/api/admin/diets/${this.selectedUser.email}`, {
        dietPlan: this.selectedUser.dietPlan,
      })
      .subscribe({
        next: () => {
          alert(`✅ Diet updated for ${this.selectedUser.email}`);
          this.diets[this.selectedIndex!] = { ...this.selectedUser };
          this.searchByEmail(); // Refresh list
        },
        error: () => {
          alert('❌ Failed to update diet');
        }
      });
  }
}
