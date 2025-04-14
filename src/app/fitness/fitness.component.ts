import { Component, HostListener, ElementRef, Renderer2, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fitness',
  imports: [FooterComponent,FormsModule,CommonModule,RouterLink],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.css'
})
export class FitnessComponent {
  selectedGoal: string = 'loss';
  
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
