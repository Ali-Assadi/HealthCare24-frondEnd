import { Component } from '@angular/core';

@Component({
  selector: 'app-user-home',
  standalone: true,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
  userEmail: string = '';

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || 'Guest';
  }
}
