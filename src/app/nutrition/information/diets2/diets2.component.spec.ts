import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIETS2Component } from './diets2.component';

describe('DIETS2Component', () => {
  let component: DIETS2Component;
  let fixture: ComponentFixture<DIETS2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DIETS2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DIETS2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
