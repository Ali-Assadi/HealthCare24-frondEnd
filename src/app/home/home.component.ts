import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  recommendations: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/user-views/${email}`)
      .subscribe((views) => {
        const recentTopics = [...new Set(views.map((v) => v.topic))].slice(-4);
        this.recommendations = recentTopics;
      });
  }

  formatTopicName(topic: string): string {
    return topic
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
