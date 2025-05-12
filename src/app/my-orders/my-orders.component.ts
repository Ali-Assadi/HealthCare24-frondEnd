import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  imports: [CommonModule],
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  userId = localStorage.getItem('userId');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.userId) {
      this.http
        .get<any[]>(`http://localhost:3000/api/orders/${this.userId}`)
        .subscribe({
          next: (data) => (this.orders = data),
          error: (err) => console.error('Failed to load orders', err),
        });
    }
  }
}
