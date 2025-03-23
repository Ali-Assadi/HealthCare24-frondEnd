import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports:[CommonModule,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    // Listen for route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  // Method to determine navbar color based on the current route
  getNavbarColor(): string {
    switch (this.currentRoute) {
      case '/nutrition':
        return '#A63D2E'; // Nutrition color
      case '/life':
        return '#223182'; // Life color
      case '/health':
        return '#4A8F63'; // Health color
      default:
        return '#4A8F63'; // Default color
    }
  }

  // Method to collapse the navbar menu
  collapseMenu(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }
}