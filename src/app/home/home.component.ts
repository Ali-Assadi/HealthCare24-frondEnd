// home.component.ts
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
  lastTopics: string[] = [];
  lastSection: string = '';
  sectionRecommendations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/user-views/${email}`)
      .subscribe((views) => {
        const recentViews = [...views].reverse();
        this.lastTopics = recentViews.slice(0, 4).map((v) => v.topic);
        this.lastSection = recentViews[0]?.section || '';

        if (this.lastSection) {
          this.http
            .get<any[]>(
              `http://localhost:3000/api/${this.lastSection}Articles/${
                this.lastSection === 'health'
                  ? 'brain'
                  : this.lastSection === 'fitness'
                  ? 'strength'
                  : 'meals'
              }`
            )
            .subscribe((data) => {
              this.sectionRecommendations = data.slice(0, 4);
            });
        }
      });
  }

  formatTopicName(topic: string): string {
    return topic
      .replace(/^\//, '') // Remove leading slash
      .replace(/-/g, ' ') // Replace dashes with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }
}
