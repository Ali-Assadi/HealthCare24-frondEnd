import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, AdminSidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'HealthCare24';
  isAdminUser: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.isAdmin$.subscribe((status) => {
      this.isAdminUser = status;
    });
  }
}
