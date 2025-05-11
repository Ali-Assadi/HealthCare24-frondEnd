import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STRENGTHTRAINING2Component } from './strength-training2.component';

describe('STRENGTHTRAINING2Component', () => {
  let component: STRENGTHTRAINING2Component;
  let fixture: ComponentFixture<STRENGTHTRAINING2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [STRENGTHTRAINING2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(STRENGTHTRAINING2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
