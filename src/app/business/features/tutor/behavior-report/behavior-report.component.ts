import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BehaviorNote {
  id: number;
  docente: string;
  materia: string;
  fecha: string;
  tipo: 'positivo' | 'observacion' | 'incidencia';
  comentario: string;
  puntos?: number; // Sistema de puntos opcional (gamificación)
}

@Component({
  selector: 'app-behavior-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './behavior-report.component.html',
  styleUrl: './behavior-report.component.css'
})
export class BehaviorReportComponent {

  // Datos simulados de la bitácora del alumno
  notes = signal<BehaviorNote[]>([
    { id: 1, docente: 'Roberto Gómez', materia: 'Matemáticas', fecha: '2026-04-07', tipo: 'positivo', comentario: 'Excelente participación en clase y apoyo a sus compañeros.', puntos: +5 },
    { id: 2, docente: 'Lucía Fernández', materia: 'Historia', fecha: '2026-04-05', tipo: 'observacion', comentario: 'Se distrajo constantemente con el celular durante la lección.', puntos: -2 },
    { id: 3, docente: 'Marcos Rivas', materia: 'Física', fecha: '2026-04-02', tipo: 'incidencia', comentario: 'Falta de respeto al docente al ser corregido en un ejercicio.', puntos: -10 },
    { id: 4, docente: 'Elena Paz', materia: 'Literatura', fecha: '2026-03-30', tipo: 'positivo', comentario: 'Entregó un ensayo sobresaliente sobre el Quijote.', puntos: +5 }
  ]);

  // Filtro activo
  filterSelected = signal<'todos' | 'positivo' | 'incidencia'>('todos');

  // Lista filtrada reactiva
  filteredNotes = computed(() => {
    const filter = this.filterSelected();
    if (filter === 'todos') return this.notes();
    return this.notes().filter(n => n.tipo === filter);
  });

  // Balance de puntos conductuales
  totalPuntos = computed(() => 
    this.notes().reduce((acc, curr) => acc + (curr.puntos || 0), 0)
  );

}
