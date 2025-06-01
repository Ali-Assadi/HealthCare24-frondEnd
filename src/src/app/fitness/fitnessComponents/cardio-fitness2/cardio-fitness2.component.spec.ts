import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CARDIOFITNESS2Component } from './cardio-fitness2.component';

describe('CARDIOFITNESS2Component', () => {
  let component: CARDIOFITNESS2Component;
  let fixture: ComponentFixture<CARDIOFITNESS2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CARDIOFITNESS2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CARDIOFITNESS2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
