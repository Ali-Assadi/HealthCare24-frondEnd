import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealth1Component } from './heart-health-1.component';

describe('HeartHealth1Component', () => {
  let component: HeartHealth1Component;
  let fixture: ComponentFixture<HeartHealth1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealth1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartHealth1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
