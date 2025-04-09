import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainHealth5Component } from './brain-health-5.component';

describe('BrainHealth5Component', () => {
  let component: BrainHealth5Component;
  let fixture: ComponentFixture<BrainHealth5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainHealth5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainHealth5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
