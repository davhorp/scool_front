import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaseListaComponent } from './pase-lista.component';

describe('PaseListaComponent', () => {
  let component: PaseListaComponent;
  let fixture: ComponentFixture<PaseListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaseListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaseListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
