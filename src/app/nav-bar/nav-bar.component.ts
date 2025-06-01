import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

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
  isSubscribed: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.checkLoginStatus();
        this.checkNotifications();
        this.checkSubscriptionStatus();
      }
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.checkNotifications();
    this.checkSubscriptionStatus();
  }

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }

  checkNotifications() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    fetch(`http://localhost:3000/api/notifications/unread/${email}`)
      .then((res) => res.json())
      .then((data) => (this.hasUnread = data.unreadCount > 0))
      .catch(() => (this.hasUnread = false));
  }

  checkSubscriptionStatus() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.isSubscribed = false;
      return;
    }

    fetch(`http://localhost:3000/api/user/${email}`)
      .then((res) => res.json())
      .then((data) => {
        this.isSubscribed = !!data.isSubscribed;
      })
      .catch((err) => {
        console.error('Failed to check subscription status:', err);
        this.isSubscribed = false;
      });
  }

  getNavbarColor(): string {
    switch (this.currentRoute) {
      // 🔶 Nutrition Routes
      case '/nutrition':
      case '/diet-plan':
      case '/my-dietPlan':
      case '/healthy-meals':
      case '/diets1':
      case '/diets2':
      case '/diets3':
      case '/diets4':
      case '/healthy-recips1':
      case '/healthy-recips2':
      case '/healthy-recips3':
      case '/healthy-recips4':
        return '#A63D2E';
      // 🔵 Health Routes
      case '/health':
      case '/brain-health-1':
      case '/brain-health-2':
      case '/brain-health-3':
      case '/brain-health-4':
      case '/brain-health-5':
      case '/brain-health-6':
      case '/heart-health-1':
      case '/heart-health-2':
      case '/heart-health-3':
      case '/heart-health-4':
      case '/heart-health-5':
      case '/heart-health-6':
      case '/better-sleep-1':
      case '/better-sleep-2':
      case '/better-sleep-3':
      case '/better-sleep-4':
        return '#4A8F63';
      case '/fitness':
      case '/exercise-plan':
      case '/my-exercise-plan':
      case '/strength-training1':
      case '/strength-training2':
      case '/strength-training3':
      case '/cardio-training1':
      case '/cardio-training2':
      case '/cardio-training3':
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
    this.isLoggedIn = false;
    this.router.navigate(['/sign-in']);
  }
}
