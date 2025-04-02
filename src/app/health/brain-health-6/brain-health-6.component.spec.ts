import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainHealth6Component } from './brain-health-6.component';

describe('BrainHealth6Component', () => {
  let component: BrainHealth6Component;
  let fixture: ComponentFixture<BrainHealth6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainHealth6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainHealth6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
