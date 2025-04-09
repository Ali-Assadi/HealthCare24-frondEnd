import {
  Component,
  HostListener,
  ElementRef,
  Renderer2,
  QueryList,
  ViewChildren,
  OnInit
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink],
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css'],
})
export class NutritionComponent implements OnInit {
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  userInfo: any = {};
  hasPlan = false;
  showPlan = false;
  userGoal = '';
  generatedPlans: any[] = [];

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
  
    this.http.get<any>(`http://localhost:3000/api/user/${email}`).subscribe({
      next: (user) => {
        console.log('🧠 Loaded user:', user);
        console.log('📋 dietPlan exists?', Array.isArray(user.dietPlan));
        console.log('📦 dietPlan length:', user.dietPlan?.length);
  
        this.userInfo = user;
  
        // ✅ Check if user has dietPlan with at least 1 week
        this.hasPlan = Array.isArray(user.dietPlan) && user.dietPlan.length > 0;
  
        console.log('✅ hasPlan set to:', this.hasPlan);
  
        // show plan if exists
        this.showPlan = this.hasPlan;
        this.generatedPlans = user.dietPlan || [];
        this.userGoal = user.goal || '';
      },
      error: (err) => {
        console.error('❌ Failed to load user profile.', err);
      }
    });
  }
  
  
  
  

  requestNewPlan(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) return alert('You must be signed in.');

    this.http.post('http://localhost:3000/api/request-new-plan', {
      email,
      message: `User ${email} is requesting a new diet plan.`
    }).subscribe({
      next: () => alert('📩 Request sent to admin!'),
      error: () => alert('❌ Failed to send request to admin.')
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
}
