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
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink],
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css'],
})
export class NutritionComponent implements OnInit {
  isLoggedIn: boolean = false;
  products: any[] = [];

  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  userInfo: any = {};
  hasPlan = false;
  showPlan = false;
  userGoal = '';
  generatedPlans: any[] = [];
  subscribed: boolean = false;
  meals: any[] = [];
  diets: any[] = [];
  recipes: any[] = [];

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadArticles('meals');
    this.loadArticles('diets');
    this.loadArticles('recipes');

    if (this.isLoggedIn) {
      this.checkSubscriptionAndLoadProducts();
    }

    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.hasPlan = Array.isArray(user.dietPlan) && user.dietPlan.length > 0;
        this.showPlan = this.hasPlan;
        this.generatedPlans = user.dietPlan || [];
        this.userGoal = user.goal || '';
      },
      error: (err) => {
        console.error('❌ Failed to load user profile.', err);
      },
    });
  }
  checkSubscriptionAndLoadProducts() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.subscribed = !!user.isSubscribed;
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Failed to check subscription status.', err);
        this.subscribed = false;
        this.loadProducts();
      },
    });
  }

  loadProducts() {
    this.http
      .get<any[]>('http://localhost:3000/api/products/category/nutrition')
      .subscribe({
        next: (data) => {
          if (this.subscribed) {
            this.products = data.map((product) => ({
              ...product,
              originalPrice: product.price,
              price: (product.price * 0.9).toFixed(2),
            }));
          } else {
            this.products = data;
          }
        },
        error: (err) => console.error('Failed to load nutrition products', err),
      });
  }

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }

  requestNewPlan(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.error('You must be signed in.', '❌ Not Signed In');
      return;
    }

    this.http
      .post('http://localhost:3000/api/request-new-plan', {
        email,
        message: `User ${email} is requesting a new diet plan.`,
      })
      .subscribe({
        next: () => this.toastr.success('Request sent to admin!', '📩 Sent'),
        error: () =>
          this.toastr.error('Failed to send request to admin.', '❌ Error'),
      });
  }

  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.fadeElements) return;
    this.fadeElements.forEach((element) => {
      const rect = element.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8 && rect.bottom >= 0) {
        this.renderer.addClass(element.nativeElement, 'active');
      }
    });
  }

  loadArticles(category: 'meals' | 'diets' | 'recipes') {
    this.http
      .get<any[]>(`http://localhost:3000/api/nutritionArticles/${category}`)
      .subscribe({
        next: (data) => {
          if (category === 'meals') this.meals = data;
          else if (category === 'diets') this.diets = data;
          else if (category === 'recipes') this.recipes = data;
        },
        error: (err) =>
          console.error(`Failed to load ${category} articles`, err),
      });
  }
  logView(topic: string, subType: 'meals' | 'diets' | 'recipes') {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section: 'nutrition',
        subType,
      })
      .subscribe();
  }
  addToCart(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http
      .post(`http://localhost:3000/api/cart/${userId}/add`, {
        productId: product._id,
        quantity: 1,
      })
      .subscribe({
        next: () =>
          this.toastr.success(`${product.name} added to cart.`, '🛒 Added'),
        error: (err) => console.error('Failed to add to cart', err),
      });
  }

  buyNow(product: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http
      .post(`http://localhost:3000/api/cart/${userId}/add`, {
        productId: product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => (location.href = '/cart'),
        error: (err) => console.error('Failed to buy now', err),
      });
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
