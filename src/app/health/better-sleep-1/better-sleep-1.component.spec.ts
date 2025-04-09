import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterSleep1Component } from './better-sleep-1.component';

describe('BetterSleep1Component', () => {
  let component: BetterSleep1Component;
  let fixture: ComponentFixture<BetterSleep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetterSleep1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetterSleep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
