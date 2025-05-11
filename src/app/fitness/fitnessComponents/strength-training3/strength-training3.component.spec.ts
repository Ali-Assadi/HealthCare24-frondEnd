import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STRENGTHTRAINING3Component } from './strength-training3.component';

describe('STRENGTHTRAINING3Component', () => {
  let component: STRENGTHTRAINING3Component;
  let fixture: ComponentFixture<STRENGTHTRAINING3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [STRENGTHTRAINING3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(STRENGTHTRAINING3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
