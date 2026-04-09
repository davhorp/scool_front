import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRatingsComponent } from './student-ratings.component';

describe('StudentRatingsComponent', () => {
  let component: StudentRatingsComponent;
  let fixture: ComponentFixture<StudentRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRatingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
