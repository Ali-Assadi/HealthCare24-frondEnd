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
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
      error: (err) => console.error('❌ Failed to fetch user data.', err),
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
      this.toastr.error('❌ You must be signed in.');
      return;
    }

    this.http
      .post('http://localhost:3000/api/generate-exercise-plan', {
        email,
        goal: this.selectedGoal,
      })
      .subscribe({
        next: () => this.toastr.success('🏋️ Your workout plan has been saved!'),
        error: () => this.toastr.error('❌ Failed to generate workout plan.'),
      });
  }

  requestChange() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.error('❌ You must be signed in.');
      return;
    }

    this.http
      .post('http://localhost:3000/api/request-new-plan', {
        email,
        message: `User ${email} is requesting a new Exercise plan.`,
      })
      .subscribe({
        next: () => this.toastr.success('📩 Request sent to admin!'),
        error: () => this.toastr.error('❌ Failed to send request to admin.'),
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
        },
        error: (err) =>
          console.error('❌ Failed to load fitness products.', err),
      });
  }

  loadArticles(category: 'strength' | 'cardio') {
    this.http
      .get<any[]>(`http://localhost:3000/api/fitnessArticles/${category}`)
      .subscribe({
        next: (data) => {
          if (category === 'strength') this.strengthArticles = data;
          else if (category === 'cardio') this.cardioArticles = data;
        },
        error: (err) =>
          console.error(`Failed to load ${category} articles`, err),
      });
  }
  logView(topic: string, subType: 'strength' | 'cardio') {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section: 'fitness',
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
        next: () => this.toastr.success(`${product.name} added to cart.`),
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
}
