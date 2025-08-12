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
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loggedIn = !!localStorage.getItem('userId');

    if (this.loggedIn) {
      this.checkSub();
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
        },
        error: (err) =>
          console.error(`Failed to load ${category} articles`, err),
      });
  }
  private verifyStock(productId: string) {
    return this.http.get<any>(
      `http://localhost:3000/api/products/${productId}`
    );
  }

  loadProducts() {
    this.http
      .get<any[]>('http://localhost:3000/api/products/category/health')
      .subscribe({
        next: (data) => {
          const normalized = data.map((p) => {
            const qty = Number(p?.quantity ?? 0);
            const soldOut = p?.available === false || qty <= 0;

            if (this.subscribed) {
              return {
                ...p,
                originalPrice: p.price,
                price: +(p.price * 0.9).toFixed(2),
                quantity: qty,
                soldOut,
              };
            }
            return { ...p, quantity: qty, soldOut };
          });
          this.products = normalized;
        },
        error: (err) => console.error('Failed to load health products', err),
      });
  }

  // Log user view of article
  logView(topic: string, subType: 'brain' | 'heart' | 'sleep') {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section: 'health',
        subType,
      })
      .subscribe();
  }

  checkSub() {
    console.log('Checking subscription...');
    const email = localStorage.getItem('userEmail');
    if (!email) {
      console.warn('❌ No userEmail found in localStorage');
      return;
    }

    console.log('User email for subscription check:', email);

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (data) => {
        console.log('User data:', data);
        this.subscribed = !!data.isSubscribed;
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Failed to check subscription status:', err);
        this.subscribed = false;
        this.loadProducts(); // fallback
      },
    });
  }

  // ✅ prevent add if sold out + double-check with server
  addToCart(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (product?.soldOut) {
      this.toastr.warning(
        'This product is currently out of stock. Coming soon!',
        '⚠️ Not available'
      );
      return;
    }

    this.verifyStock(product._id).subscribe({
      next: (fresh) => {
        const qty = Number(fresh?.quantity ?? 0);
        if (fresh?.available === false || qty <= 0) {
          this.toastr.warning(
            'This product just went out of stock. Coming soon!',
            '⚠️ Not available'
          );
          return;
        }

        this.http
          .post(`http://localhost:3000/api/cart/${userId}/add`, {
            productId: product._id,
            quantity: 1,
          })
          .subscribe({
            next: () =>
              this.toastr.success(`${product.name} added to cart.`, '🛒 Added'),
            error: (err) => {
              if (err?.status === 400) {
                this.toastr.warning(
                  'This product is out of stock. Coming soon!',
                  '⚠️ Not available'
                );
              } else {
                this.toastr.error('Failed to add product to cart.', '❌ Error');
              }
            },
          });
      },
      error: () =>
        this.toastr.error('Failed to verify stock. Try again.', '❌ Error'),
    });
  }

  // ✅ same guard for Buy Now
  buyNow(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (product?.soldOut) {
      this.toastr.warning(
        'This product is currently out of stock. Coming soon!',
        '⚠️ Not available'
      );
      return;
    }

    this.verifyStock(product._id).subscribe({
      next: (fresh) => {
        const qty = Number(fresh?.quantity ?? 0);
        if (fresh?.available === false || qty <= 0) {
          this.toastr.warning(
            'This product just went out of stock. Coming soon!',
            '⚠️ Not available'
          );
          return;
        }

        this.http
          .post(`http://localhost:3000/api/cart/${userId}/add`, {
            productId: product._id,
            quantity: 1,
          })
          .subscribe({
            next: () => this.router.navigate(['/cart']),
            error: (err) => {
              if (err?.status === 400) {
                this.toastr.warning(
                  'This product is out of stock. Coming soon!',
                  '⚠️ Not available'
                );
              } else {
                this.toastr.error('Failed to start purchase.', '❌ Error');
              }
            },
          });
      },
      error: () =>
        this.toastr.error('Failed to verify stock. Try again.', '❌ Error'),
    });
  }
}
