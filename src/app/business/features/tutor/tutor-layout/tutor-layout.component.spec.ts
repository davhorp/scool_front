import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorLayoutComponent } from './tutor-layout.component';

describe('TutorLayoutComponent', () => {
  let component: TutorLayoutComponent;
  let fixture: ComponentFixture<TutorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
