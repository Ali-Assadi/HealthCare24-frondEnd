import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainHealth2Component } from './brain-health-2.component';

describe('BrainHealth2Component', () => {
  let component: BrainHealth2Component;
  let fixture: ComponentFixture<BrainHealth2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainHealth2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainHealth2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
