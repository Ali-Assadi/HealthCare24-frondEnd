import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExercisePlanComponent } from './my-exercise-plan.component';

describe('MyExercisePlanComponent', () => {
  let component: MyExercisePlanComponent;
  let fixture: ComponentFixture<MyExercisePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyExercisePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyExercisePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
