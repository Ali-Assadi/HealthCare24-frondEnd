import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIETS4Component } from './diets4.component';

describe('DIETS4Component', () => {
  let component: DIETS4Component;
  let fixture: ComponentFixture<DIETS4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DIETS4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DIETS4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
