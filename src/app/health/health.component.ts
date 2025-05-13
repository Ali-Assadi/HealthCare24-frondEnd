import {
  Component,
  HostListener,
  ElementRef,
  Renderer2,
  QueryList,
  ViewChildren,
  OnInit,
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [FooterComponent, RouterLink, CommonModule],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css'],
})
export class HealthComponent implements OnInit {
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  products: any[] = [];
  brainArticles: any[] = [];
  heartArticles: any[] = [];
  sleepArticles: any[] = [];

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadArticles('brain');
    this.loadArticles('heart');
    this.loadArticles('sleep');
  }

  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.fadeElements) return;
    this.fadeElements.forEach((element) => {
      const nativeElement = element.nativeElement;
      const rect = nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom >= 0) {
        this.renderer.addClass(nativeElement, 'active');
      }
    });
  }

  // Load health articles by category
  loadArticles(category: 'brain' | 'heart' | 'sleep') {
    this.http
      .get<any[]>(`http://localhost:3000/api/healthArticles/${category}`)
      .subscribe({
        next: (data) => {
          if (category === 'brain') this.brainArticles = data;
          else if (category === 'heart') this.heartArticles = data;
          else if (category === 'sleep') this.sleepArticles = data;
        },
        error: (err) =>
          console.error(`Failed to load ${category} articles`, err),
      });
  }

  // Load products from MongoDB
  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  // Log user view of article
  logView(topic: string) {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section: 'health', // or 'fitness', or 'nutrition'
      })
      .subscribe();
  }

  // Add product to cart
  addToCart(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http
      .post(`http://localhost:3000/api/cart/${userId}/add`, {
        productId: product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => alert(`${product.name} added to cart.`),
        error: (err) => console.error('Failed to add to cart', err),
      });
  }

  // Add product to cart and navigate to cart
  buyNow(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http
      .post(`http://localhost:3000/api/cart/${userId}/add`, {
        productId: product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => this.router.navigate(['/cart']),
        error: (err) => console.error('Failed to buy now', err),
      });
  }
}
