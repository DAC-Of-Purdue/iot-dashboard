import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeComponent } from './realtime.component';

describe('RealtimeComponent', () => {
  let component: RealtimeComponent;
  let fixture: ComponentFixture<RealtimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RealtimeComponent]
    });
    fixture = TestBed.createComponent(RealtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
