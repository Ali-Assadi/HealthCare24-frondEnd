import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STRENGTHTRAINING1Component } from './strength-training1.component';

describe('STRENGTHTRAINING1Component', () => {
  let component: STRENGTHTRAINING1Component;
  let fixture: ComponentFixture<STRENGTHTRAINING1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [STRENGTHTRAINING1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(STRENGTHTRAINING1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
