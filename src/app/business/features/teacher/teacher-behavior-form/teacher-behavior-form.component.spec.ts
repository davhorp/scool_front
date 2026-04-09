import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherBehaviorFormComponent } from './teacher-behavior-form.component';

describe('TeacherBehaviorFormComponent', () => {
  let component: TeacherBehaviorFormComponent;
  let fixture: ComponentFixture<TeacherBehaviorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherBehaviorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherBehaviorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
