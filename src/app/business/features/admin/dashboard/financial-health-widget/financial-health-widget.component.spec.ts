import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialHealthWidgetComponent } from './financial-health-widget.component';

describe('FinancialHealthWidgetComponent', () => {
  let component: FinancialHealthWidgetComponent;
  let fixture: ComponentFixture<FinancialHealthWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialHealthWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialHealthWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
