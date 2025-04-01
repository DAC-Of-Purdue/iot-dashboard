import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgWeekComponent } from './ag-week.component';

describe('AgWeekComponent', () => {
  let component: AgWeekComponent;
  let fixture: ComponentFixture<AgWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgWeekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
