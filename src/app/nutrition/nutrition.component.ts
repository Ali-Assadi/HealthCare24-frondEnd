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
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadArticles('meals');
    this.loadArticles('diets');
    this.loadArticles('recipes');

    if (this.isLoggedIn) {
      this.checkSubscriptionAndLoadProducts();
    } else {
      this.toastr.info('Log in to unlock subscription benefits and personalized plans.', 'Not Logged In');
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('Please log in to view your nutrition plan.', 'Login Required');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.hasPlan = Array.isArray(user.dietPlan) && user.dietPlan.length > 0;
        this.showPlan = this.hasPlan;
        this.generatedPlans = user.dietPlan || [];
        this.userGoal = user.goal || '';
        if (this.hasPlan) {
          this.toastr.success('Your nutrition plan loaded successfully!', 'Plan Loaded');
        } else {
          this.toastr.info('No nutrition plan found. Generate one to get started!', 'No Plan');
        }
      },
      error: (err) => {
        console.error('❌ Failed to load user profile.', err);
        this.toastr.error('Failed to load user profile.', 'Error');
      },
    });
  }

  checkSubscriptionAndLoadProducts() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('User not logged in. Cannot check subscription or load products.', 'Login Required');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        this.subscribed = !!user.isSubscribed;
        this.toastr.info(`Subscription status: ${this.subscribed ? 'Active' : 'Inactive'}`, 'Subscription');
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Failed to check subscription status.', err);
        this.toastr.error('Failed to check subscription status.', 'Error');
        this.subscribed = false;
        this.loadProducts(); // fallback
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
          this.toastr.success('Nutrition products loaded successfully!', 'Products Loaded');
        },
        error: (err) => {
          console.error('Failed to load nutrition products', err);
          this.toastr.error('Failed to load nutrition products.', 'Error');
        },
      });
  }

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }

  requestNewPlan(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('You must be signed in to request a new plan.', 'Login Required');
      return;
    }

    this.http
      .post('http://localhost:3000/api/request-new-plan', {
        email,
        message: `User ${email} is requesting a new diet plan.`,
      })
      .subscribe({
        next: () => this.toastr.success('Request sent to admin!', 'Request Sent'),
        error: (err) => {
          console.error('❌ Failed to send request to admin.', err);
          this.toastr.error('Failed to send request to admin.', 'Error');
        },
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
          this.toastr.success(`${category.charAt(0).toUpperCase() + category.slice(1)} articles loaded.`, 'Articles Loaded');
        },
        error: (err) => {
          console.error(`Failed to load ${category} articles`, err);
          this.toastr.error(`Failed to load ${category} articles.`, 'Error');
        },
      });
  }

  logView(topic: string, section: string) {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('User not logged in. Cannot log view.', 'Login Required');
      return;
    }

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section,
      })
      .subscribe({
        error: (err) => console.error('Failed to log view:', err) // No toast for background logging errors
      });
  }

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
          location.href = '/cart'; // Redirect to cart page
        },
        error: (err) => {
          console.error('Failed to buy now', err);
          this.toastr.error(`Failed to add ${product.name} to cart for purchase.`, 'Error');
        },
      });
  }
}
