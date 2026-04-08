import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDashComponent } from './payment-dash.component';

describe('PaymentDashComponent', () => {
  let component: PaymentDashComponent;
  let fixture: ComponentFixture<PaymentDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
