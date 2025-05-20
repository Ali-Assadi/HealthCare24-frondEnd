import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIETS1Component } from './diets1.component';

describe('DIETS1Component', () => {
  let component: DIETS1Component;
  let fixture: ComponentFixture<DIETS1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DIETS1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DIETS1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
