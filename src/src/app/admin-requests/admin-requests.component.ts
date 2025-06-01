import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.css'],
})
export class AdminRequestsComponent implements OnInit {
  users: any[] = [];
  chatStatusMap: { [email: string]: 'start' | 'conversation' } = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/api/admin/users').subscribe({
      next: (data) => {
        this.users = data.filter((user) => !user.isAdmin);
        for (const user of this.users) {
          this.checkIfChatExists(user.email);
        }
      },
      error: (err) => {
        console.error('❌ Failed to load users:', err);
        this.users = [];
      },
    });
  }

  checkIfChatExists(email: string): void {
    this.http.get<any[]>(`http://localhost:3000/api/chat/${email}`).subscribe({
      next: (messages) => {
        const status: 'start' | 'conversation' =
          messages.length > 0 ? 'conversation' : 'start';
        this.chatStatusMap[email] = status;
        console.log(`[DEBUG] ${email} chat status: ${status}`);
      },
      error: () => {
        this.chatStatusMap[email] = 'start';
        console.warn(`[WARN] No chat found for ${email}`);
      },
    });
  }

  startChat(email: string): void {
    this.router.navigate([`/admin-chat/${encodeURIComponent(email)}`]);
  }

  trackByEmail(index: number, user: any): string {
    return user.email;
  }
}
