import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipsDiscountsComponent } from './scholarships-discounts.component';

describe('ScholarshipsDiscountsComponent', () => {
  let component: ScholarshipsDiscountsComponent;
  let fixture: ComponentFixture<ScholarshipsDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScholarshipsDiscountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScholarshipsDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
