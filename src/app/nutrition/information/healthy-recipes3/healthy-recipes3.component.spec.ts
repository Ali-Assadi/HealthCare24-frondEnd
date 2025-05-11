import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HEALTHYRECIPES3Component } from './healthy-recipes3.component';

describe('HEALTHYRECIPES3Component', () => {
  let component: HEALTHYRECIPES3Component;
  let fixture: ComponentFixture<HEALTHYRECIPES3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HEALTHYRECIPES3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HEALTHYRECIPES3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
