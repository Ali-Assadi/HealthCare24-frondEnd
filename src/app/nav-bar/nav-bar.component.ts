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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  // navBar Color
  getNavbarColor(): string {
    switch (this.currentRoute) {
      case '/nutrition':
        return '#A63D2E';
      case '/life':
        return '#223182';
      case '/health':
        return '#4A8F63';
      case '/fitness':
        return 'hsl(247, 49%, 38%)';
      default:
        return '#000';
    }
  }

  // navBar Collapse
  collapseMenu(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }
}