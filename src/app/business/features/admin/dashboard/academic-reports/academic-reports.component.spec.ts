import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicReportsComponent } from './academic-reports.component';

describe('AcademicReportsComponent', () => {
  let component: AcademicReportsComponent;
  let fixture: ComponentFixture<AcademicReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
