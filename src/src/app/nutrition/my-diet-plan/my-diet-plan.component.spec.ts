import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDietPlanComponent } from './my-diet-plan.component';

describe('MyDietPlanComponent', () => {
  let component: MyDietPlanComponent;
  let fixture: ComponentFixture<MyDietPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDietPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDietPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
