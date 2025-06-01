import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STRENGTHTRAINING4Component } from './strength-training4.component';

describe('STRENGTHTRAINING4Component', () => {
  let component: STRENGTHTRAINING4Component;
  let fixture: ComponentFixture<STRENGTHTRAINING4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [STRENGTHTRAINING4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(STRENGTHTRAINING4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
