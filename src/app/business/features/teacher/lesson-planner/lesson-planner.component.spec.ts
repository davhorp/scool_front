import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlannerComponent } from './lesson-planner.component';

describe('LessonPlannerComponent', () => {
  let component: LessonPlannerComponent;
  let fixture: ComponentFixture<LessonPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonPlannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
