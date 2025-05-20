import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CARDIOFITNESS3Component } from './cardio-fitness3.component';

describe('CARDIOFITNESS3Component', () => {
  let component: CARDIOFITNESS3Component;
  let fixture: ComponentFixture<CARDIOFITNESS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CARDIOFITNESS3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CARDIOFITNESS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
