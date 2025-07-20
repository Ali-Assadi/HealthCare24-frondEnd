import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exe-pics',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './exe-pics.component.html',
  styleUrls: ['./exe-pics.component.css'],
})
export class ExePicsComponent implements OnInit {
  pictures: any[] = [];
  filteredPictures: any[] = [];
  searchTerm: string = '';
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPictures();
  }

  fetchPictures(): void {
    this.http.get<any[]>('http://localhost:3000/api/exePictures').subscribe({
      next: (res) => {
        console.log('✅ Received pictures:', res);
        this.pictures = res;
        this.filteredPictures = res;
        this.loading = false;
      },
      error: () => {
        console.error('❌ Failed to load pictures');
        this.loading = false;
      },
    });
  }

  filterPictures(): void {
    const term = this.searchTerm?.toLowerCase() || '';
    this.filteredPictures = this.pictures.filter((pic) =>
      pic.name.toLowerCase().includes(term)
    );
  }
}
