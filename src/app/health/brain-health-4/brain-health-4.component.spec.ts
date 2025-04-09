import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainHealth4Component } from './brain-health-4.component';

describe('BrainHealth4Component', () => {
  let component: BrainHealth4Component;
  let fixture: ComponentFixture<BrainHealth4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainHealth4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainHealth4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
