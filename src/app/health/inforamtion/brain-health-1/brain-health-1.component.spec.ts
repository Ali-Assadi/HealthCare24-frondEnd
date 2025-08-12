import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainHealth1Component } from './brain-health-1.component';

describe('BrainHealth1Component', () => {
  let component: BrainHealth1Component;
  let fixture: ComponentFixture<BrainHealth1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainHealth1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainHealth1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
