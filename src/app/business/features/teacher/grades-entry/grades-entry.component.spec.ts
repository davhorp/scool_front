import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesEntryComponent } from './grades-entry.component';

describe('GradesEntryComponent', () => {
  let component: GradesEntryComponent;
  let fixture: ComponentFixture<GradesEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
