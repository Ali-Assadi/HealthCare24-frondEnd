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

    type Section = 'health' | 'nutrition' | 'fitness';

    this.http
      .get<any[]>(`http://localhost:3000/api/user-views/${email}`)
      .subscribe((views) => {
        const recentViews = [...views].reverse().slice(0, 10); // last 10 views
        const lastThree = recentViews.slice(0, 3);

        this.lastTopics = lastThree.map((v) => v.topic);

        // Count section occurrences
        const sectionCounts = lastThree.reduce(
          (acc: Record<string, number>, v) => {
            acc[v.section] = (acc[v.section] || 0) + 1;
            return acc;
          },
          {}
        );

        // Determine dominant section
        const dominantSection = Object.keys(sectionCounts).reduce((a, b) =>
          sectionCounts[a] >= sectionCounts[b] ? a : b
        ) as Section;

        // Define allowed subtypes per section
        const sectionSubtypes: Record<Section, string[]> = {
          health: ['brain', 'heart', 'sleep'],
          nutrition: ['meals', 'diets', 'recipes'],
          fitness: ['strength', 'cardio'],
        };

        // Use subType directly from DB
        const subtypesInRecent = lastThree
          .filter((v) => v.section === dominantSection && v.subType)
          .map((v) => v.subType);

        const selectedSubtype =
          subtypesInRecent[0] || sectionSubtypes[dominantSection][0];

        this.lastSection = dominantSection;

        this.http
          .get<any[]>(
            `http://localhost:3000/api/${dominantSection}Articles/${selectedSubtype}`
          )
          .subscribe((data) => {
            this.sectionRecommendations = data.slice(0, 4);
          });
      });
  }

  formatTopicName(topic: string): string {
    return topic
      .replace(/^\//, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
