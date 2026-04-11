import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAssignmentComponent } from './schedule-assignment.component';

describe('ScheduleAssignmentComponent', () => {
  let component: ScheduleAssignmentComponent;
  let fixture: ComponentFixture<ScheduleAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
