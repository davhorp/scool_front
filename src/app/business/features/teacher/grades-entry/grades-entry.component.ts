import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';

interface StudentGrade {
  id: number;
  nombre: string;
  p1: number; // Parcial 1
  p2: number; // Parcial 2
  p3: number; // Parcial 3
}

@Component({
  selector: 'app-grades-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grades-entry.component.html',
  styleUrl: './grades-entry.component.css'
})
export class GradesEntryComponent {

  private toastService = inject(ToastService);

  // Contexto de la carga
  selectedSubject = signal('Matemáticas III');
  selectedGroup = signal('3° A - Secundaria');
  selectedTerm = signal(1); // 1er, 2do o 3er Trimestre

  // Lista de alumnos con sus notas del trimestre actual
  students = signal<StudentGrade[]>([
    { id: 1, nombre: 'Ana García', p1: 9, p2: 8.5, p3: 0 },
    { id: 2, nombre: 'Carlos López', p1: 6, p2: 5.5, p3: 0 },
    { id: 3, nombre: 'Daniela Sosa', p1: 10, p2: 9.8, p3: 0 }
  ]);

  // Cálculo de promedio grupal en tiempo real
  groupAverage = computed(() => {
    const list = this.students();
    const sum = list.reduce((acc, s) => acc + (s.p1 + s.p2 + s.p3) / 3, 0);
    return (sum / list.length).toFixed(2);
  });

  updateGrade(studentId: number, field: 'p1' | 'p2' | 'p3', value: number) {
    // Validación: No permitir notas fuera de rango 0-10
    if (value < 0 || value > 10) {
      this.toastService.show('Valor Inválido', 'La nota debe estar entre 0 y 10', 'warning');
      return;
    }

    this.students.update(list => 
      list.map(s => s.id === studentId ? { ...s, [field]: value } : s)
    );
  }

  saveTermGrades() {
    this.toastService.show(
      'Guardando...', 
      `Sincronizando notas del ${this.selectedTerm()}° Trimestre`, 
      'info'
    );
    
    // Simulación de envío al backend (Spring Boot: POST /api/calificaciones/batch)
    setTimeout(() => {
      this.toastService.show('¡Éxito!', 'Calificaciones publicadas correctamente.', 'success');
    }, 1500);
  }
}
