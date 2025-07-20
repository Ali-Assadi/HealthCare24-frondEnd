import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExePicsComponent } from './exe-pics.component';

describe('ExePicsComponent', () => {
  let component: ExePicsComponent;
  let fixture: ComponentFixture<ExePicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExePicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExePicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
