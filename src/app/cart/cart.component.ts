import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    this.checkSubscriptionStatus();
  }

  loadCart() {
    if (!this.userId) {
      this.toastr.warning('User not logged in. Cannot load cart.', 'Login Required');
      return;
    }

    this.http
      .get<any>(`http://localhost:3000/api/cart/${this.userId}`)
      .subscribe({
        next: (data) => {
          if (this.subscribed) {
            data.items = data.items.map((item: any) => ({
              ...item,
              originalPrice: item.price,
              price: (item.price * 0.9).toFixed(2), // Apply 10% discount
            }));
            data.totalPrice = data.items
              .reduce((sum: number, item: any) => {
                return sum + parseFloat(item.price) * item.quantity; // Use parseFloat for calculation
              }, 0)
              .toFixed(2);
          }
          this.cart = data;
          this.toastr.success('Cart loaded successfully!', 'Cart Updated');
        },
        error: (err) => {
          console.error('Error loading cart', err);
          this.toastr.error('Failed to load cart.', 'Cart Error');
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
      .subscribe({
        next: () => {
          this.loadCart();
          this.toastr.success('Item removed from cart.', 'Item Removed');
        },
        error: (err) => {
          console.error('Failed to remove item:', err);
          this.toastr.error('Failed to remove item from cart.', 'Error');
        },
      });
  }

  checkSubscriptionStatus() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      console.warn('No user email found for subscription status check.');
      this.subscribed = false;
      this.loadCart();
      this.loadOrders();
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.subscribed = !!user.isSubscribed;
        this.toastr.info(`Subscription status: ${this.subscribed ? 'Active' : 'Inactive'}`, 'Subscription');
        this.loadCart();
        this.loadOrders();
      },
      error: (err) => {
        console.warn('Could not fetch subscription status:', err);
        this.toastr.error('Could not fetch subscription status.', 'Error');
        this.subscribed = false;
        this.loadCart();
        this.loadOrders();
      },
    });
  }

  clearCart() {
    this.http
      .delete(`http://localhost:3000/api/cart/${this.userId}/clear`)
      .subscribe({
        next: () => {
          this.loadCart();
          this.toastr.success('Cart cleared successfully!', 'Cart Cleared');
        },
        error: (err) => {
          console.error('Failed to clear cart:', err);
          this.toastr.error('Failed to clear cart.', 'Error');
        },
      });
  }

  purchase() {
    if (!this.userId) {
      this.toastr.warning('User not logged in. Cannot place order.', 'Login Required');
      return;
    }
    if (!this.cart || this.cart.items.length === 0) {
      this.toastr.warning('Your cart is empty. Add items before purchasing.', 'Empty Cart');
      return;
    }

    this.http
      .post(`http://localhost:3000/api/orders/${this.userId}`, {})
      .subscribe({
        next: () => {
          this.toastr.success('Order placed successfully!', 'Order Confirmed'); // Success toast
          this.loadCart();
          this.loadOrders();
        },
        error: (err) => {
          console.error('Order failed', err);
          this.toastr.error('Order failed. Please try again.', 'Order Failed'); // Error toast
        },
      });
  }

  loadOrders() {
    if (!this.userId) {
      this.toastr.warning('User not logged in. Cannot load orders.', 'Login Required');
      return;
    }

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
                  return sum + parseFloat(item.price) * item.quantity;
                }, 0)
                .toFixed(2);
              return { ...order, items: updatedItems, totalPrice: newTotal };
            });
          }
          this.orders = data;
          this.toastr.success('Order history loaded successfully!', 'Orders Loaded');
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.toastr.error('Failed to load order history.', 'Orders Error');
        },
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
          (item.price * item.quantity).toFixed(2) // Ensure price is formatted
        }`,
        10,
        y
      );
      y += 8;
    });

    doc.setFontSize(12);
    doc.text(`Total: $${order.totalPrice}`, 10, y + 10);

    doc.save(`receipt_${order._id}.pdf`);
    this.toastr.info('Downloading receipt...', 'Receipt Download');
  }
}
