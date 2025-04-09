import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealth6Component } from './heart-health-6.component';

describe('HeartHealth6Component', () => {
  let component: HeartHealth6Component;
  let fixture: ComponentFixture<HeartHealth6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealth6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartHealth6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
