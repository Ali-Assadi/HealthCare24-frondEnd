import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent]
})
export class AdminComponent implements OnInit {
  userCount: number = 0;
  plansGenerated: number = 0;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/admin/dashboard').subscribe({
      next: (data) => {
        this.userCount = data.userCount;
        this.plansGenerated = data.plansGenerated;
        this.loading = false;
        console.log(data.plansGenerated);
      },
      error: (err) => {
        console.error('Failed to load admin stats:', err);
        this.loading = false;
      }
    });
  }
}
