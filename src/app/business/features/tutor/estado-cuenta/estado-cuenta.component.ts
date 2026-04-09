import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-cuenta.component.html',
  styleUrl: './estado-cuenta.component.css'
})
export class EstadoCuentaComponent {

  resumenFinanciero = signal({
    deudaTotal: 1250.50,
    fechaProximoPago: '15 de Mayo, 2026'
  });

  cargosPendientes = signal([
    { 
      id: 1, 
      concepto: 'Kit de Robótica - 2do Semestre', 
      categoria: 'Material Didáctico', 
      monto: 850, 
      fechaVencimiento: '10 May 2026', 
      atrasado: false 
    },
    { 
      id: 2, 
      concepto: 'Consumo Cafetería - Abril', 
      categoria: 'Cafetería', 
      monto: 400.50, 
      fechaVencimiento: '01 May 2026', 
      atrasado: true 
    }
  ]);

  historialPagos = signal([
    { concepto: 'Colegiatura Abril', monto: 4500, fechaPago: '02 Abr 2026', referencia: 'PAY-8821' },
    { concepto: 'Seguro Escolar Anual', monto: 1200, fechaPago: '15 Mar 2026', referencia: 'PAY-7710' },
    { concepto: 'Uniforme Deportivo', monto: 950, fechaPago: '01 Mar 2026', referencia: 'PAY-6605' }
  ]);
}
