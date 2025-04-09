import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealth4Component } from './heart-health-4.component';

describe('HeartHealth4Component', () => {
  let component: HeartHealth4Component;
  let fixture: ComponentFixture<HeartHealth4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealth4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartHealth4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
