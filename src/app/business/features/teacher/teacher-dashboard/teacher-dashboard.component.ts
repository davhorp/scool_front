import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';

interface ClassSchedule {
  id: number;
  materia: string;
  grado: string;
  hora: string;
  aula: string;
  estudiantes: number;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {

  private toastService = inject(ToastService);


  // En tu TeacherDashboardComponent
isModalOpen = signal(false);
selectedTask = signal<any>(null);


  // Estado del Docente
  teacherName = signal('Prof. Roberto Gómez');
  currentDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  // Horario del día
  todayClasses = signal<ClassSchedule[]>([
    { id: 101, materia: 'Matemáticas Avanzadas', grado: '3° A', hora: '08:00 - 09:30', aula: 'Laboratorio 2', estudiantes: 25 },
    { id: 102, materia: 'Álgebra II', grado: '2° B', hora: '10:00 - 11:30', aula: 'Aula 10', estudiantes: 30 },
    { id: 103, materia: 'Física I', grado: '3° A', hora: '12:00 - 13:30', aula: 'Aula 05', estudiantes: 22 }
  ]);

  // Asistencia de la clase actual
  attendanceList = signal([
    { id: 1, nombre: 'Ana García', estado: 'presente' },
    { id: 2, nombre: 'Carlos López', estado: 'ausente' },
    { id: 3, nombre: 'Daniela Sosa', estado: 'tarde' }
  ]);

  // Tareas pendientes por corregir
  pendingTasks = signal([
    { id: 50, titulo: 'Examen de Cálculo', grupo: '3° A', entregas: 24, total: 25 },
    { id: 51, titulo: 'Guía de Parabolas', grupo: '2° B', entregas: 15, total: 30 }
  ]);

  ngOnInit() {
    this.toastService.show('¡Buen día, Profe!', 'Su jornada de hoy incluye 3 clases.', 'info');
  }

  markAttendance(studentId: number, status: any) {
    this.attendanceList.update(list => 
      list.map(s => s.id === studentId ? { ...s, estado: status } : s)
    );
  }

  saveAttendance() {
    this.toastService.show('Asistencia Guardada', 'El registro se sincronizó con el panel administrativo.', 'success');
  }

  openModal(task: any) {
  this.selectedTask.set(task);
  this.isModalOpen.set(true);
}

closeModal() {
  this.isModalOpen.set(false);
}
}