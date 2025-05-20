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
<<<<<<< HEAD
    selector: 'app-health',
    standalone: true,
    imports: [FooterComponent, RouterLink, CommonModule],
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.css'],
})
export class HealthComponent implements OnInit {
    @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

    brainProducts: any[] = []; // Array to hold brain category products
    brainArticles: any[] = [];
    heartArticles: any[] = [];
    sleepArticles: any[] = [];
=======
  selector: 'app-health',
  imports: [FooterComponent, RouterLink, CommonModule],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css'],
})
export class HealthComponent implements OnInit {
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;
  products: any[] = [];
>>>>>>> parent of 4848038 (update cart , track for user update home page)

    constructor(
        private viewportScroller: ViewportScroller,
        private renderer: Renderer2,
        private http: HttpClient,
        private router: Router
    ) {}

<<<<<<< HEAD
    ngOnInit() {
        this.loadBrainProducts(); // Load only brain category products
        this.loadArticles('brain');
        this.loadArticles('heart');
        this.loadArticles('sleep');
    }
=======
  ngOnInit() {
    this.loadProducts();
  }
>>>>>>> parent of 4848038 (update cart , track for user update home page)

    scrollTo(sectionId: string): void {
        this.viewportScroller.scrollToAnchor(sectionId);
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

<<<<<<< HEAD
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

    // Load products from MongoDB and filter for 'brain' category
    loadBrainProducts() {
        this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
            next: (data) => {
                this.brainProducts = data.filter(product => product.category === 'brain');
            },
            error: (err) => console.error('Failed to load brain products', err),
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
=======
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.fadeElements) return;
    this.fadeElements.forEach((element) => {
      const nativeElement = element.nativeElement;
      const rect = nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom >= 0) {
        this.renderer.addClass(nativeElement, 'active');
      }
    });
  }

  // Load products from MongoDB
  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  // Log the view to backend
  logView(topic: string) {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section: 'health',
      })
      .subscribe();
  }
  addToCart(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
>>>>>>> parent of 4848038 (update cart , track for user update home page)

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

<<<<<<< HEAD
    // Add product to cart and navigate to cart
    buyNow(product: any) {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
=======
  buyNow(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
>>>>>>> parent of 4848038 (update cart , track for user update home page)

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