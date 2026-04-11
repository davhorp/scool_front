import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelinquencyReportComponent } from './delinquency-report.component';

describe('DelinquencyReportComponent', () => {
  let component: DelinquencyReportComponent;
  let fixture: ComponentFixture<DelinquencyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelinquencyReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DelinquencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
