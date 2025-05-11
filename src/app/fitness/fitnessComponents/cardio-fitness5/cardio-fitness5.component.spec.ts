import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CARDIOFITNESS5Component } from './cardio-fitness5.component';

describe('CARDIOFITNESS5Component', () => {
  let component: CARDIOFITNESS5Component;
  let fixture: ComponentFixture<CARDIOFITNESS5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CARDIOFITNESS5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CARDIOFITNESS5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
