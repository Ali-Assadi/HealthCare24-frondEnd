import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealth5Component } from './heart-health-5.component';

describe('HeartHealth5Component', () => {
  let component: HeartHealth5Component;
  let fixture: ComponentFixture<HeartHealth5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealth5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartHealth5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
