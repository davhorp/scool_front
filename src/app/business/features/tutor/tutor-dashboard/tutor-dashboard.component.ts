import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-dashboard.component.html',
  styleUrl: './tutor-dashboard.component.css'
})
export class TutorDashboardComponent {

  // Datos falsos: Lista de hijos vinculados
  hijos = signal([
    { id: 1, nombre: 'Lucía Pérez', grado: '3° A Primaria', promedio: 9.2, faltaPago: false, foto: 'https://i.pravatar.cc/100?u=lucia' },
    { id: 2, nombre: 'Mateo Pérez', grado: '1° B Secundaria', promedio: 7.5, faltaPago: true, foto: 'https://i.pravatar.cc/100?u=mateo' }
  ]);

  // Notificaciones de la escuela
  notificaciones = signal([
    { id: 1, titulo: 'Junta de Padres', fecha: '12 Abr', contenido: 'Reunión trimestral a las 18:00 hrs.', tipo: 'urgente' },
    { id: 2, titulo: 'Suspensión de Clases', fecha: '01 May', contenido: 'Día del trabajo - Plantel cerrado.', tipo: 'info' }
  ]);

  // Pagos pendientes consolidados
  pagosPendientes = signal([
    { concepto: 'Colegiatura Abril - Mateo', monto: 2500, vencimiento: '05/04/2026' },
    { concepto: 'Material Didáctico - Lucía', monto: 850, vencimiento: '15/04/2026' }
  ]);

  deudaTotal = computed(() => 
    this.pagosPendientes().reduce((acc, p) => acc + p.monto, 0)
  );
  
}
