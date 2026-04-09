import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijoDetalleComponent } from './hijo-detalle.component';

describe('HijoDetalleComponent', () => {
  let component: HijoDetalleComponent;
  let fixture: ComponentFixture<HijoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HijoDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HijoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
