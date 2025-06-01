import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDietsComponent } from './admin-diets.component';

describe('AdminDietsComponent', () => {
  let component: AdminDietsComponent;
  let fixture: ComponentFixture<AdminDietsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDietsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDietsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
