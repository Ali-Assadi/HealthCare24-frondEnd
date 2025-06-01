import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CARDIOFITNESS4Component } from './cardio-fitness4.component';

describe('CARDIOFITNESS4Component', () => {
  let component: CARDIOFITNESS4Component;
  let fixture: ComponentFixture<CARDIOFITNESS4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CARDIOFITNESS4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CARDIOFITNESS4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
