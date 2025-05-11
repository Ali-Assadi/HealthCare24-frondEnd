import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HEALTHYRECIPES4Component } from './healthy-recipes4.component';

describe('HEALTHYRECIPES4Component', () => {
  let component: HEALTHYRECIPES4Component;
  let fixture: ComponentFixture<HEALTHYRECIPES4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HEALTHYRECIPES4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HEALTHYRECIPES4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
