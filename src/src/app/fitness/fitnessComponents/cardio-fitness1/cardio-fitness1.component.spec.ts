import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CARDIOFITNESS1Component } from './cardio-fitness1.component';

describe('CARDIOFITNESS1Component', () => {
  let component: CARDIOFITNESS1Component;
  let fixture: ComponentFixture<CARDIOFITNESS1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CARDIOFITNESS1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CARDIOFITNESS1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
