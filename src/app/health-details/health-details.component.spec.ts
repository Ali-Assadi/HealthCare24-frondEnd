import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthDetailsComponent } from './health-details.component';

describe('HealthDetailsComponent', () => {
  let component: HealthDetailsComponent;
  let fixture: ComponentFixture<HealthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
