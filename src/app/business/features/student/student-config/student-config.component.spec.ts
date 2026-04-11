import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentConfigComponent } from './student-config.component';

describe('StudentConfigComponent', () => {
  let component: StudentConfigComponent;
  let fixture: ComponentFixture<StudentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
