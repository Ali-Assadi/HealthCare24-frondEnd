import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HEALTHYRECIPES1Component } from './healthy-recipes1.component';

describe('HEALTHYRECIPES1Component', () => {
  let component: HEALTHYRECIPES1Component;
  let fixture: ComponentFixture<HEALTHYRECIPES1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HEALTHYRECIPES1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HEALTHYRECIPES1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
