import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  currentRoute: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.checkLoginStatus();
      }
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
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
    this.isLoggedIn = false;
    this.router.navigate(['/sign-in']);
  }
  
}
