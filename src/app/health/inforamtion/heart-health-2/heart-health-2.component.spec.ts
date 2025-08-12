import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartHealth2Component } from './heart-health-2.component';

describe('HeartHealth2Component', () => {
  let component: HeartHealth2Component;
  let fixture: ComponentFixture<HeartHealth2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartHealth2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartHealth2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
