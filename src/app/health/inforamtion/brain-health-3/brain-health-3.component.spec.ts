import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainHealth3Component } from './brain-health-3.component';

describe('BrainHealth3Component', () => {
  let component: BrainHealth3Component;
  let fixture: ComponentFixture<BrainHealth3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainHealth3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainHealth3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
