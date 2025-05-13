import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  currentRoute: string = '';
  isLoggedIn: boolean = false;
  hasUnread: boolean = false;
  hasCartItems = false;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');

    this.checkLoginStatus();
    this.checkNotifications();

    // 🔁 Update current route + login + notifications
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.checkLoginStatus();
        this.checkNotifications();
      }
    });

    // 🔴 Check cart state on app load
    if (userId) {
      this.cartService.checkCart(userId);
    }

    // 🔁 Subscribe to cart updates
    this.cartService.hasItems$.subscribe((hasItems) => {
      this.hasCartItems = hasItems;
    });
  }

  checkNotifications() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    fetch(`http://localhost:3000/api/notifications/unread/${email}`)
      .then((res) => res.json())
      .then((data) => (this.hasUnread = data.unreadCount > 0))
      .catch(() => (this.hasUnread = false));
  }

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }

  getNavbarColor(): string {
    switch (this.currentRoute) {
      case '/nutrition':
      case '/my-dietPlan':
      case '/diet-plan':
        return '#A63D2E';
      case '/life':
        return '#223182';
      case '/health':
        return '#4A8F63';
      case '/fitness':
      case '/exercise-plan':
        return 'hsl(247, 49%, 38%)';
      default:
        return '#2c3e50';
    }
  }

  collapseMenu(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }

  logout(): void {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.cartService.setCartState(false);
    this.router.navigate(['/sign-in']);
  }
}
