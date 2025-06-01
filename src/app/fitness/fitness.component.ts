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
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-fitness',
  standalone: true,
  imports: [FooterComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.css',
})
export class FitnessComponent implements OnInit {
  selectedGoal: string = 'loss';
  isLoggedIn: boolean = false;
  hasExercisePlan = false;
  products: any[] = [];
  strengthArticles: any[] = [];
  cardioArticles: any[] = [];
  subscribed: boolean = false;

  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http: HttpClient,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadArticles('strength');
    this.loadArticles('cardio');
    if (this.isLoggedIn) {
      this.checkSubscriptionAndLoadProducts();
    }

    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http.get(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user: any) => {
        this.hasExercisePlan = user.exercisePlan?.length > 0;
      },
      error: (err) => {
        console.error('❌ Failed to fetch user data.', err);
        this.toastr.error('Failed to fetch user data.', 'Error'); // Error toast for user data
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
        this.loadProducts();
      },
    });
  }

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }

  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

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

  generatePlan() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('You must be signed in to generate a plan.', 'Login Required');
      return;
    }

    this.http
      .post('http://localhost:3000/api/generate-exercise-plan', {
        email,
        goal: this.selectedGoal,
      })
      .subscribe({
        next: () => this.toastr.success('Your workout plan has been saved!', 'Plan Generated'),
        error: (err) => {
          console.error('Failed to generate workout plan:', err);
          this.toastr.error('Failed to generate workout plan.', 'Error');
        },
      });
  }

  requestChange() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('You must be signed in to request a change.', 'Login Required');
      return;
    }

    this.http
      .post('http://localhost:3000/api/request-new-plan', {
        email,
        message: `User ${email} is requesting a new Exercise plan.`,
      })
      .subscribe({
        next: () => this.toastr.success('Request sent to admin!', 'Request Sent'),
        error: (err) => {
          console.error('Failed to send request to admin:', err);
          this.toastr.error('Failed to send request to admin.', 'Error');
        },
      });
  }

  loadProducts() {
    this.http
      .get<any[]>('http://localhost:3000/api/products/category/fitness')
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
          this.toastr.success('Fitness products loaded successfully!', 'Products Loaded');
        },
        error: (err) => {
          console.error('❌ Failed to load fitness products.', err);
          this.toastr.error('Failed to load fitness products.', 'Error');
        },
      });
  }

  loadArticles(category: 'strength' | 'cardio') {
    this.http
      .get<any[]>(`http://localhost:3000/api/fitnessArticles/${category}`)
      .subscribe({
        next: (data) => {
          if (category === 'strength') this.strengthArticles = data;
          else if (category === 'cardio') this.cardioArticles = data;
          this.toastr.success(`${category.charAt(0).toUpperCase() + category.slice(1)} articles loaded.`, 'Articles Loaded');
        },
        error: (err) => {
          console.error(`Failed to load ${category} articles`, err);
          this.toastr.error(`Failed to load ${category} articles.`, 'Error');
        },
      });
  }

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
