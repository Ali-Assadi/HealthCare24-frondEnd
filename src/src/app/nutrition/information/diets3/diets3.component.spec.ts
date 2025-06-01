import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIETS3Component } from './diets3.component';

describe('DIETS3Component', () => {
  let component: DIETS3Component;
  let fixture: ComponentFixture<DIETS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DIETS3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DIETS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
