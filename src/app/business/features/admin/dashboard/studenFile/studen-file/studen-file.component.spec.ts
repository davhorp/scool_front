import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenFileComponent } from './studen-file.component';

describe('StudenFileComponent', () => {
  let component: StudenFileComponent;
  let fixture: ComponentFixture<StudenFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudenFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudenFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
