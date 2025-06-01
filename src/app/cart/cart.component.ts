import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any;
  orders: any[] = [];
  subscribed: boolean = false;

  userId = localStorage.getItem('userId');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkSubscriptionStatus();
  }

  loadCart() {
    if (!this.userId) return;

    this.http
      .get<any>(`http://localhost:3000/api/cart/${this.userId}`)
      .subscribe({
        next: (data) => {
          if (this.subscribed) {
            data.items = data.items.map((item: any) => ({
              ...item,
              originalPrice: item.price,
              price: (item.price * 0.9).toFixed(2),
            }));
            data.totalPrice = data.items
              .reduce((sum: number, item: any) => {
                return sum + item.price * item.quantity;
              }, 0)
              .toFixed(2);
          }
          this.cart = data;
        },
        error: (err) => console.error('Error loading cart', err),
      });
  }

  removeItem(productId: string) {
    this.http
      .request(
        'delete',
        `http://localhost:3000/api/cart/${this.userId}/remove`,
        {
          body: { productId },
        }
      )
      .subscribe(() => this.loadCart());
  }
  checkSubscriptionStatus() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.subscribed = !!user.isSubscribed;
        this.loadCart();
        this.loadOrders();
      },
      error: () => {
        console.warn('Could not fetch subscription status');
        this.subscribed = false;
        this.loadCart();
        this.loadOrders();
      },
    });
  }

  clearCart() {
    this.http
      .delete(`http://localhost:3000/api/cart/${this.userId}/clear`)
      .subscribe(() => this.loadCart());
  }

  purchase() {
    if (!this.userId) return;

    this.http
      .post(`http://localhost:3000/api/orders/${this.userId}`, {})
      .subscribe({
        next: () => {
          alert('✅ Order placed successfully!');
          this.loadCart();
          this.loadOrders();
        },
        error: (err) => {
          console.error('Order failed', err);
          alert('❌ Order failed.');
        },
      });
  }

  loadOrders() {
    if (!this.userId) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/orders/${this.userId}`)
      .subscribe({
        next: (data) => {
          if (this.subscribed) {
            data = data.map((order) => {
              const updatedItems = order.items.map((item: any) => ({
                ...item,
                originalPrice: item.price,
                price: (item.price * 0.9).toFixed(2),
              }));
              const newTotal = updatedItems
                .reduce((sum: number, item: any) => {
                  return sum + item.price * item.quantity;
                }, 0)
                .toFixed(2);
              return { ...order, items: updatedItems, totalPrice: newTotal };
            });
          }
          this.orders = data;
        },
        error: (err) => console.error('Failed to load orders', err),
      });
  }

  downloadReceipt(order: any) {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Order Receipt', 10, 10);

    doc.setFontSize(11);
    doc.text(`Order ID: ${order._id}`, 10, 20);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 10, 28);

    let y = 40;
    order.items.forEach((item: any, index: number) => {
      doc.text(
        `${index + 1}. ${item.productId.name} x${item.quantity} = $${
          item.price * item.quantity
        }`,
        10,
        y
      );
      y += 8;
    });

    doc.setFontSize(12);
    doc.text(`Total: $${order.totalPrice}`, 10, y + 10);

    doc.save(`receipt_${order._id}.pdf`);
  }
}
