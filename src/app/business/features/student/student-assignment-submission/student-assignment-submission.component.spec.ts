import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAssignmentSubmissionComponent } from './student-assignment-submission.component';

describe('StudentAssignmentSubmissionComponent', () => {
  let component: StudentAssignmentSubmissionComponent;
  let fixture: ComponentFixture<StudentAssignmentSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAssignmentSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentAssignmentSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
