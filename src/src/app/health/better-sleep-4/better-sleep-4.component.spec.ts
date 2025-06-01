import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetterSleep4Component } from './better-sleep-4.component';

describe('BetterSleep4Component', () => {
  let component: BetterSleep4Component;
  let fixture: ComponentFixture<BetterSleep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetterSleep4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetterSleep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
