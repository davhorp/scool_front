import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ScheduleEntry {
  materia: string;
  docente: string;
  horaInicio: string;
  horaFin: string;
  dia: number; // 1: Lunes, 2: Martes...
  color: string;
  salon: string;
}

interface StudentClass {
  id: string;
  horaInicio: string;
  horaFin: string;
  materia: string;
  docente: string;
  salon: string;// <--- Agrega esto con el signo de interrogación (opcional)
  color: string;
  estado: 'pasada' | 'activa' | 'proxima';
}

// Añade esta interfaz arriba de tu componente
interface TareaPendiente {
  id: string;
  titulo: string;
  materia: string;
  vencimiento: string;
  urgencia: 'alta' | 'media' | 'baja';
}

@Component({
  selector: 'app-student-schedule',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-schedule.component.html',
  styleUrl: './student-schedule.component.css'
})
export class StudentScheduleComponent {

  vistaActual = signal<'diaria' | 'semanal'>('diaria');

  // Datos del estudiante (Simulados)
  estudiante = signal({ nombre: 'Sofía', grado: '3° A Secundaria' });
  
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  diaSeleccionado = signal('Miércoles'); // Idealmente se calcula con new Date().getDay()

// Día actual (1-5 para Lunes-Viernes)
  today = signal(new Date().getDay());

  // NUEVO: Signal de Tareas Pendientes
  tareasPendientes = signal<TareaPendiente[]>([
    { 
      id: 'T-402', 
      titulo: 'Ensayo sobre la Revolución Industrial', 
      materia: 'Historia Universal', 
      vencimiento: 'Vence hoy', 
      urgencia: 'alta' 
    },
    { 
      id: 'T-105', 
      titulo: 'Problemario de Vectores', 
      materia: 'Física I', 
      vencimiento: 'Mañana', 
      urgencia: 'media' 
    },
    { 
      id: 'T-880', 
      titulo: 'Lectura: El Quijote (Cap. 1-5)', 
      materia: 'Literatura', 
      vencimiento: 'Viernes', 
      urgencia: 'baja' 
    }
  ]);

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Horario extraído de la base de datos para este alumno específico
  horarioCompleto = signal<Record<string, StudentClass[]>>({
    'Miércoles': [
      { id: '1', horaInicio: '07:00', horaFin: '08:40', materia: 'Matemáticas', docente: 'Ing. Roberto Ramos', salon: 'Salón 101', color: '#3b82f6', estado: 'pasada' },
      { id: '2', horaInicio: '08:40', horaFin: '09:00', materia: 'Receso', docente: '', salon: 'Patio Central', color: '#e2e8f0', estado: 'pasada' },
      { id: '3', horaInicio: '09:00', horaFin: '10:40', materia: 'Física', docente: 'Lic. María Torres', salon: 'Laboratorio A', color: '#ef4444', estado: 'activa' },
      { id: '4', horaInicio: '10:40', horaFin: '12:20', materia: 'Historia', docente: 'Mtra. Lucía Méndez', salon: 'Salón 101', color: '#10b981', estado: 'proxima' }
    ]
  });
  
  // Datos simulados (Vendrían de Spring Boot: GET /api/horarios/alumno/123)
  schedule = signal<ScheduleEntry[]>([
    { materia: 'Matemáticas III', docente: 'Roberto Gómez', horaInicio: '08:00', horaFin: '09:30', dia: 1, salon: 'A-10', color: '#6c5ce7' },
    { materia: 'Física I', docente: 'Marcos Rivas', horaInicio: '10:00', horaFin: '11:30', dia: 1, salon: 'Lab-2', color: '#fab1a0' },
    { materia: 'Historia', docente: 'Lucía Fdez', horaInicio: '08:00', horaFin: '09:30', dia: 2, salon: 'A-05', color: '#00cec9' },
    { materia: 'Literatura', docente: 'Elena Paz', horaInicio: '08:00', horaFin: '09:30', dia: 3, salon: 'Biblioteca', color: '#fdcb6e' },
    { materia: 'Matemáticas III', docente: 'Roberto Gómez', horaInicio: '10:00', horaFin: '11:30', dia: 3, salon: 'A-10', color: '#6c5ce7' },
    { materia: 'Inglés IV', docente: 'John Doe', horaInicio: '08:00', horaFin: '09:30', dia: 4, salon: 'A-02', color: '#a29bfe' },
    { materia: 'Deportes', docente: 'Entr. Cano', horaInicio: '08:00', horaFin: '09:30', dia: 5, salon: 'Cancha', color: '#55efc4' },
  ]);

  // Filtro reactivo: Solo devuelve las clases del día seleccionado
  clasesDelDia = computed(() => {
    return this.horarioCompleto()[this.diaSeleccionado()] || [];
  });

  // Filtramos las clases según el día seleccionado en la cuadrícula
  getClassesForDay(dayIndex: number) {
    return this.schedule().filter(entry => entry.dia === dayIndex + 1);
  }

  seleccionarDia(dia: string) {
    this.diaSeleccionado.set(dia);
  }

}
