import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../service/cart.service'; // adjust path
import jsPDF from 'jspdf';
import { Cart } from '../models/cart.model'; // adjust path if needed

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  showOrdersPopup = false;
  cart: Cart | null = null;
  orders: any[] = [];
  userId = localStorage.getItem('userId');

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
    this.loadOrders();
  }

  loadCart() {
    if (!this.userId) return;
    this.http
      .get<Cart>(`http://localhost:3000/api/cart/${this.userId}`)
      .subscribe({
        next: (data) => {
          this.cart = data;
          this.cartService.setCartState(data.items.length > 0);
        },
        error: (err) => {
          console.error('Error loading cart', err);
          this.cartService.setCartState(false);
        },
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
        next: (data) => (this.orders = data),
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
  showOrders() {
    this.showOrdersPopup = true;
  }

  closeOrders() {
    this.showOrdersPopup = false;
  }
}
