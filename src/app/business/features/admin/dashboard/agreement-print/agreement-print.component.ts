import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interfaz para asegurar que los datos del convenio 
 * mantengan la integridad estructural.
 */
export interface AgreementData {
  id: number;
  tutor: string;
  alumno: string;
  deudaOriginal: number;
  becaNombre: string;
  descuento: number;
  montoFinal: number;
}

@Component({
  selector: 'app-agreement-print',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agreement-print.component.html',
  styleUrls: ['./agreement-print.component.css']
})
export class AgreementPrintComponent {
  /**
   * Utilizamos input signals (Angular 18) para recibir 
   * los datos de forma reactiva desde el componente de becas.
   */
  datos = input.required<AgreementData>();

  /**
   * Fecha constante para el momento de la firma.
   */
  fechaActual = new Date();

  constructor() {}
}