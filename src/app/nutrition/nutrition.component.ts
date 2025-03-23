import { Component, HostListener, ElementRef, Renderer2, QueryList, ViewChildren } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent {
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2
  ) {}

  // Method to scroll to a specific section
  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  // Listen for scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.fadeElements.forEach((element) => {
      const nativeElement = element.nativeElement;
      const rect = nativeElement.getBoundingClientRect();

      // Check if the element is in the viewport
      if (rect.top < window.innerHeight * 0.8 && rect.bottom >= 0) {
        this.renderer.addClass(nativeElement, 'active');
      }
    });
  }
}