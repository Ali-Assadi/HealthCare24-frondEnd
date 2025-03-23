import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  // Method to scroll to a specific section
  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}