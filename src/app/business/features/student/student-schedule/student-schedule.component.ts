import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScheduleEntry {
  materia: string;
  docente: string;
  horaInicio: string;
  horaFin: string;
  dia: number; // 1: Lunes, 2: Martes...
  aula: string;
  color: string;
}

@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-schedule.component.html',
  styleUrl: './student-schedule.component.css'
})
export class StudentScheduleComponent {

// Día actual (1-5 para Lunes-Viernes)
  today = signal(new Date().getDay());

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  // Datos simulados (Vendrían de Spring Boot: GET /api/horarios/alumno/123)
  schedule = signal<ScheduleEntry[]>([
    { materia: 'Matemáticas III', docente: 'Roberto Gómez', horaInicio: '08:00', horaFin: '09:30', dia: 1, aula: 'A-10', color: '#6c5ce7' },
    { materia: 'Física I', docente: 'Marcos Rivas', horaInicio: '10:00', horaFin: '11:30', dia: 1, aula: 'Lab-2', color: '#fab1a0' },
    { materia: 'Historia', docente: 'Lucía Fdez', horaInicio: '08:00', horaFin: '09:30', dia: 2, aula: 'A-05', color: '#00cec9' },
    { materia: 'Literatura', docente: 'Elena Paz', horaInicio: '08:00', horaFin: '09:30', dia: 3, aula: 'Biblioteca', color: '#fdcb6e' },
    { materia: 'Matemáticas III', docente: 'Roberto Gómez', horaInicio: '10:00', horaFin: '11:30', dia: 3, aula: 'A-10', color: '#6c5ce7' },
    { materia: 'Inglés IV', docente: 'John Doe', horaInicio: '08:00', horaFin: '09:30', dia: 4, aula: 'A-02', color: '#a29bfe' },
    { materia: 'Deportes', docente: 'Entr. Cano', horaInicio: '08:00', horaFin: '09:30', dia: 5, aula: 'Cancha', color: '#55efc4' },
  ]);

  // Filtramos las clases según el día seleccionado en la cuadrícula
  getClassesForDay(dayIndex: number) {
    return this.schedule().filter(entry => entry.dia === dayIndex + 1);
  }

}
