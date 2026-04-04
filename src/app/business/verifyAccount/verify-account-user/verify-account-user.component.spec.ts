import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountUserComponent } from './verify-account-user.component';

describe('VerifyAccountUserComponent', () => {
  let component: VerifyAccountUserComponent;
  let fixture: ComponentFixture<VerifyAccountUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyAccountUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyAccountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
