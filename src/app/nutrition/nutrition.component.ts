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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { catchError, tap, of } from 'rxjs';

interface NutritionArticle {
  _id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink],
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css'],
})
export class NutritionComponent implements OnInit {
  isLoggedIn: boolean = false;

  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  userInfo: any = {};
  hasPlan = false;
  showPlan = false;
  userGoal = '';
  generatedPlans: any[] = [];

  healthyMeals: NutritionArticle[] = [];
  diets: NutritionArticle[] = [];
  healthyRecipes: NutritionArticle[] = [];
  products: any[] = [];
  nutritionProducts: any[] = [];

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadProducts();
    this.loadNutritionArticlesByCategory('meals', this.healthyMeals);
    this.loadNutritionArticlesByCategory('diets', this.diets);
    this.loadNutritionArticlesByCategory('recipes', this.healthyRecipes);

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

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }

  requestNewPlan(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return alert('You must be signed in.');

    this.http
      .post('http://localhost:3000/api/request-new-plan', {
        email,
        message: `User ${email} is requesting a new diet plan.`,
      })
      .subscribe({
        next: () => alert('📩 Request sent to admin!'),
        error: () => alert('❌ Failed to send request to admin.'),
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

  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/api/Products').subscribe({
      next: (data) => {
        this.products = data;
        this.nutritionProducts = this.products.filter(product => product.category === 'nutrition');
      },
      error: (err) => console.error('Failed to load nutrition products', err),
    });
  }

  loadNutritionArticlesByCategory(category: string, targetArray: NutritionArticle[]) {
    this.http.get<NutritionArticle[]>(`http://localhost:3000/api/nutritionArticles/${category}`)
      .pipe(
        tap((data) => {
          targetArray.push(...data);
          console.log(`Loaded ${data.length} articles for category: ${category}`, data);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(`Failed to load ${category}`, error);
          return of([]); // Return an empty array so the app doesn't break
        })
      )
      .subscribe();
  }

  logView(topic: string, section: string) {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    this.http
      .post('http://localhost:3000/api/log-view', {
        email,
        topic,
        section,
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
        next: () => alert(`${product.name} added to cart.`),
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
        next: () => this.router.navigate(['/cart']),
        error: (err) => console.error('Failed to buy now', err),
      });
  }
}