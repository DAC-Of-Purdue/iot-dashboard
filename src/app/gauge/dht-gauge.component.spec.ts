import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhtGaugeComponent } from './dht-gauge.component';

describe('DhtGaugeComponent', () => {
  let component: DhtGaugeComponent;
  let fixture: ComponentFixture<DhtGaugeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DhtGaugeComponent]
    });
    fixture = TestBed.createComponent(DhtGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
