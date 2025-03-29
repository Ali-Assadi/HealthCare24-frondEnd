import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-health-details',
  imports: [FooterComponent],
  templateUrl: './health-details.component.html',
  styleUrls: ['./health-details.component.css']
})
export class HealthDetailsComponent implements OnInit {
  articleContent: string = '';  // To hold the article content or error message

  ngOnInit(): void {
    // Get the article ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId: string | null = urlParams.get("id");

    if (articleId) {
      // Find the corresponding article element
      const article = document.getElementById(articleId);
      if (article) {
        this.articleContent = article.innerHTML;  // Set the article content
      } else {
        this.articleContent = "<h2>Article not found</h2>";  // Display error if article is not found
      }
    } else {
      this.articleContent = "<h2>No article selected</h2>";  // Default message if no ID is provided
    }
  }
}
