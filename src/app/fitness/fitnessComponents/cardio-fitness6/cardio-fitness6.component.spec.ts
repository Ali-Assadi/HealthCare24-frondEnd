import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CARDIOFITNESS6Component } from './cardio-fitness6.component';

describe('CARDIOFITNESS6Component', () => {
  let component: CARDIOFITNESS6Component;
  let fixture: ComponentFixture<CARDIOFITNESS6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CARDIOFITNESS6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CARDIOFITNESS6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
