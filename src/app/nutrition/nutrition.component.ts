import {
  Component,
  HostListener,
  ElementRef,
  Renderer2,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css'],
  imports: [FooterComponent],
})
export class NutritionComponent {

  //Scroll Method
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;
  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2
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
}
