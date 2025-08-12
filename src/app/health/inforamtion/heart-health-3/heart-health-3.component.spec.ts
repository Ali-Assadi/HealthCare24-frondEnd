import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealth3Component } from './heart-health-3.component';

describe('HeartHealth3Component', () => {
  let component: HeartHealth3Component;
  let fixture: ComponentFixture<HeartHealth3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealth3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartHealth3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
