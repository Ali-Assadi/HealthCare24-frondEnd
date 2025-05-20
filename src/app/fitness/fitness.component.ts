<<<<<<< HEAD
import {
    Component,
    HostListener,
    ElementRef,
    Renderer2,
    QueryList,
    ViewChildren,
    OnInit,
} from '@angular/core';
=======
import { Component, HostListener, ElementRef, Renderer2, QueryList, ViewChildren } from '@angular/core';
>>>>>>> parent of 4848038 (update cart , track for user update home page)
import { CommonModule, ViewportScroller } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Import Router

@Component({
<<<<<<< HEAD
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

    strengthArticles: any[] = [];
    cardioArticles: any[] = [];
    fitnessProducts: any[] = []; // Array to hold fitness products

    @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

    constructor(
        private viewportScroller: ViewportScroller,
        private renderer: Renderer2,
        private http: HttpClient,
        private router: Router // Inject Router
    ) {}

    ngOnInit(): void {
        this.checkLoginStatus();
        this.loadArticles('strength');
        this.loadArticles('cardio');
        this.loadFitnessProducts(); // Load fitness products

        const email = localStorage.getItem('userEmail');
        if (!email) return;

        this.http.get(`http://localhost:3000/api/user/${email}`).subscribe({
            next: (user: any) => {
                this.hasExercisePlan = user.exercisePlan?.length > 0;
            },
            error: (err) => console.error('❌ Failed to fetch user data.', err),
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
        if (!email) return alert('You must be signed in.');

        this.http
            .post('http://localhost:3000/api/generate-exercise-plan', {
                email,
                goal: this.selectedGoal,
            })
            .subscribe({
                next: () => alert('Your workout plan has been saved!'),
                error: () => alert('Failed to generate workout plan.'),
            });
    }

    requestChange() {
        const email = localStorage.getItem('userEmail');
        if (!email) return alert('You must be signed in.');

        this.http
            .post('http://localhost:3000/api/request-new-plan', {
                email,
                message: `User ${email} is requesting a new Exercise plan.`,
            })
            .subscribe({
                next: () => alert('📩 Request sent to admin!'),
                error: () => alert('❌ Failed to send request to admin.'),
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

    loadFitnessProducts() {
        this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
            next: (data) => {
                // Filter products where the category is 'fitness'
                this.fitnessProducts = data.filter(product => product.category === 'fitness');
            },
            error: (err) => console.error('Failed to load fitness products', err),
        });
    }

    logView(topic: string) {
        const email = localStorage.getItem('userEmail');
        if (!email) return;

        this.http
            .post('http://localhost:3000/api/log-view', {
                email,
                topic,
                section: 'fitness', // Updated section
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
=======
  selector: 'app-fitness',
  imports: [FooterComponent,FormsModule,CommonModule,RouterLink],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.css'
})
export class FitnessComponent {
  selectedGoal: string = 'loss';
  isLoggedIn: boolean = false;

  checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    this.isLoggedIn = !!userEmail;
  }
  
  //Scroll Method
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;
  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http : HttpClient
  ) {}
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
    if (!email) return alert('You must be signed in.');

    this.http.post('http://localhost:3000/api/generate-exercise-plan', {
      email,
      goal: this.selectedGoal
    }).subscribe({
      next: (res) => {
        alert('Your workout plan has been saved!');
        console.log(res);
      },
      error: () => alert('Failed to generate workout plan.')
    });
  }
  hasExercisePlan = false;
  ngOnInit(): void {
      this.checkLoginStatus();
      const email = localStorage.getItem('userEmail');
      this.http.get(`http://localhost:3000/api/user/${email}`).subscribe({
        next: (user: any) => {
        this.hasExercisePlan = user.exercisePlan?.length > 0;
      }
    });
  }
  requestChange(){
      const email = localStorage.getItem('userEmail');
      if (!email) return alert('You must be signed in.');
  
      this.http.post('http://localhost:3000/api/request-new-plan', {
        email,
        message: `User ${email} is requesting a new Exercise plan.`
      }).subscribe({
        next: () => alert('📩 Request sent to admin!'),
        error: () => alert('❌ Failed to send request to admin.')
      });
  }
}
>>>>>>> parent of 4848038 (update cart , track for user update home page)
