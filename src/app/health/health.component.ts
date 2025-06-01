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
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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
  loggedIn: boolean = false;
  subscribed: boolean = false;

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit() {
    this.loggedIn = !!localStorage.getItem('userId');

    if (this.loggedIn) {
      this.checkSub();
    } else {
      this.toastr.info('Log in to unlock subscription benefits.', 'Not Logged In');
    }

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

  loadArticles(category: 'brain' | 'heart' | 'sleep') {
    this.http
      .get<any[]>(`http://localhost:3000/api/healthArticles/${category}`)
      .subscribe({
        next: (data) => {
          if (category === 'brain') this.brainArticles = data;
          else if (category === 'heart') this.heartArticles = data;
          else if (category === 'sleep') this.sleepArticles = data;
          this.toastr.success(`${category.charAt(0).toUpperCase() + category.slice(1)} articles loaded.`, 'Articles Loaded');
        },
        error: (err) => {
          console.error(`Failed to load ${category} articles`, err);
          this.toastr.error(`Failed to load ${category} articles.`, 'Error');
        },
      });
  }

  loadProducts() {
    console.log('Loading products... Subscribed:', this.subscribed);

    this.http
      .get<any[]>('http://localhost:3000/api/products/category/health')
      .subscribe({
        next: (data) => {
          console.log('Loaded products from backend:', data);
          if (this.subscribed) {
            this.products = data.map((product) => ({
              ...product,
              originalPrice: product.price,
              price: (product.price * 0.9).toFixed(2),
            }));
          } else {
            this.products = data;
          }
          this.toastr.success('Health products loaded successfully!', 'Products Loaded');
        },
        error: (err) => {
          console.error('Failed to load health products', err);
          this.toastr.error('Failed to load health products.', 'Error');
        },
      });
  }

  // Log user view of article
  logView(topic: string) {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('User not logged in. Cannot log view.', 'Login Required');
      return;
    }

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section: 'health', // or 'fitness', or 'nutrition'
      })
      .subscribe({
        error: (err) => console.error('Failed to log view:', err) // No toast for background logging errors
      });
  }

  // Add product to cart
  addToCart(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.toastr.warning('You must be signed in to add items to cart.', 'Login Required');
      return;
    }

    this.http
      .post(`http://localhost:3000/api/cart/${userId}/add`, {
        productId: product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => this.toastr.success(`${product.name} added to cart.`, 'Item Added'),
        error: (err) => {
          console.error('Failed to add to cart', err);
          this.toastr.error(`Failed to add ${product.name} to cart.`, 'Error');
        },
      });
  }

  checkSub() {
    console.log('Checking subscription...');
    const email = localStorage.getItem('userEmail');
    if (!email) {
      console.warn('❌ No userEmail found in localStorage');
      this.toastr.warning('No user email found to check subscription.', 'Missing Email');
      return;
    }

    console.log('User email for subscription check:', email);

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (data) => {
        console.log('User data:', data);
        this.subscribed = !!data.isSubscribed;
        this.toastr.info(`Subscription status: ${this.subscribed ? 'Active' : 'Inactive'}`, 'Subscription');
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Failed to check subscription status:', err);
        this.toastr.error('Failed to check subscription status.', 'Error');
        this.subscribed = false;
        this.loadProducts(); // fallback
      },
    });
  }

  // Add product to cart and navigate to cart
  buyNow(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.toastr.warning('You must be signed in to buy now.', 'Login Required');
      return;
    }

    this.http
      .post(`http://localhost:3000/api/cart/${userId}/add`, {
        productId: product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.toastr.success(`${product.name} added to cart. Redirecting...`, 'Added to Cart');
          this.router.navigate(['/cart']); // Use Angular Router for navigation
        },
        error: (err) => {
          console.error('Failed to buy now', err);
          this.toastr.error(`Failed to add ${product.name} to cart for purchase.`, 'Error');
        },
      });
  }
}
