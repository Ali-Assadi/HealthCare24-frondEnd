import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/notifications/${email}`)
      .subscribe((data) => {
        this.notifications = data;
        this.markAllAsRead(email);
      });
  }

  markAllAsRead(email: string) {
    this.http
      .post(`http://localhost:3000/api/notifications/mark-read`, { email })
      .subscribe();
  }
}
