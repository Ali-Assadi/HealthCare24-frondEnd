import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HEALTHYMEALSComponent } from './healthy-meals.component';

describe('HEALTHYMEALSComponent', () => {
  let component: HEALTHYMEALSComponent;
  let fixture: ComponentFixture<HEALTHYMEALSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HEALTHYMEALSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HEALTHYMEALSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
