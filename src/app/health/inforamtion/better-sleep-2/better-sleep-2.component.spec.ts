import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterSleep2Component } from './better-sleep-2.component';

describe('BetterSleep2Component', () => {
  let component: BetterSleep2Component;
  let fixture: ComponentFixture<BetterSleep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetterSleep2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetterSleep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
