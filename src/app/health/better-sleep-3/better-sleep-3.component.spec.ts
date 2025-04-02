import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterSleep3Component } from './better-sleep-3.component';

describe('BetterSleep3Component', () => {
  let component: BetterSleep3Component;
  let fixture: ComponentFixture<BetterSleep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetterSleep3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetterSleep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
