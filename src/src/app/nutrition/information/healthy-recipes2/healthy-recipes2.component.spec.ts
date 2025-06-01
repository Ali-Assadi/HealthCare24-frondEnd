import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HEALTHYRECIPES2Component } from './healthy-recipes2.component';

describe('HEALTHYRECIPES2Component', () => {
  let component: HEALTHYRECIPES2Component;
  let fixture: ComponentFixture<HEALTHYRECIPES2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HEALTHYRECIPES2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HEALTHYRECIPES2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
