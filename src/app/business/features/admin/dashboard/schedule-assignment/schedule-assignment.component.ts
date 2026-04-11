import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ScheduleSlot {
  hora: string;
  dia: string;
  materia?: string;
  docente?: string;
  color?: string;
}

interface Docente {
  id: number;
  nombre: string;
  especialidad: string;
}

@Component({
  selector: 'app-schedule-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-assignment.component.html',
  styleUrls: ['./schedule-assignment.component.css']
})
export class ScheduleAssignmentComponent {
  
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
  
  salones = ['Salón 101', 'Salón 102', 'Laboratorio A', 'Auditorio'];
  salonSeleccionado = signal('Salón 101');

  // 1. Lista de docentes (esto vendría de tu API de Spring Boot)
  listaDocentes = signal<Docente[]>([
    { id: 1, nombre: 'Ing. Roberto Ramos', especialidad: 'Matemáticas' },
    { id: 2, nombre: 'Lic. María Torres', especialidad: 'Física' },
    { id: 3, nombre: 'Dr. Armando Casas', especialidad: 'Arquitectura' },
    { id: 4, nombre: 'Mtra. Lucía Méndez', especialidad: 'Historia' }
  ]);

  // 2. Signal para el docente elegido en el selector
  idDocenteSeleccionado = signal<string>('');

  // Materias disponibles para asignar
  materias = [
    { nombre: 'Matemáticas', color: '#dbeafe', texto: '#1e40af' },
    { nombre: 'Física', color: '#fef2f2', texto: '#991b1b' },
    { nombre: 'Historia', color: '#f0fdf4', texto: '#166534' },
    { nombre: 'Programación', color: '#faf5ff', texto: '#6b21a8' }
  ];

  // Estado de la retícula de horarios
  horarios = signal<ScheduleSlot[]>([
    { hora: '07:00', dia: 'Lunes', materia: 'Matemáticas', docente: 'Ing. Ramos', color: '#dbeafe' },
    { hora: '09:00', dia: 'Martes', materia: 'Física', docente: 'Lic. Torres', color: '#fef2f2' }
  ]);

  // Obtener el contenido de una celda específica
  getSlot(dia: string, hora: string) {
    return this.horarios().find(s => s.dia === dia && s.hora === hora);
  }

 // 3. Método asignarMateria actualizado
  asignarMateria(dia: string, hora: string) {
    // Validamos que se haya seleccionado un docente primero
    const id = this.idDocenteSeleccionado();
    if (!id) {
      alert('⚠️ Por favor, selecciona un docente de la lista antes de asignar.');
      return;
    }

    const docenteObj = this.listaDocentes().find(d => d.id === +id);
    if (!docenteObj) return;

    // Aplicamos la validación de conflictos que hicimos antes
    const tieneConflicto = this.validarConflictoDocente(docenteObj.nombre, dia, hora);

    if (tieneConflicto) {
      alert(`🚨 El docente ${docenteObj.nombre} ya tiene clase en otro salón a esta hora.`);
      return;
    }

    this.horarios.update(current => {
      const cleaned = current.filter(s => !(s.dia === dia && s.hora === hora));
      return [...cleaned, { 
        dia, 
        hora, 
        materia: docenteObj.especialidad, // La materia se deduce de su especialidad
        docente: docenteObj.nombre, 
        color: this.obtenerColorPorMateria(docenteObj.especialidad)
      }];
    });
  }

  private obtenerColorPorMateria(materia: string): string {
    const colores: any = {
      'Matemáticas': '#dbeafe',
      'Física': '#fef2f2',
      'Historia': '#f0fdf4',
      'Arquitectura': '#faf5ff'
    };
    return colores[materia] || '#f1f5f9';
  }

private validarConflictoDocente(docente: string, dia: string, hora: string): boolean {
  /* En una App real, aquí consultaríamos un Servicio que tenga los horarios 
     de TODOS los salones. Aquí simulamos una búsqueda en un array global.
  */
  const todosLosHorarios = this.obtenerTodosLosHorariosDelColegio(); 
  
  return todosLosHorarios.some(slot => 
    slot.docente === docente && 
    slot.dia === dia && 
    slot.hora === hora && 
    slot.salon !== this.salonSeleccionado() // El conflicto es si está en OTR salón
  );
}

  limpiarHorario() {
    if(confirm('¿Vaciar todo el horario de este salón?')) {
      this.horarios.set([]);
    }
  }

  private obtenerTodosLosHorariosDelColegio() {
  // Simulación de datos provenientes de otros salones
  return [
    { hora: '07:00', dia: 'Lunes', docente: 'Ing. Ramos', salon: 'Salón 102' },
    { hora: '10:00', dia: 'Miércoles', docente: 'Lic. Torres', salon: 'Laboratorio A' }
  ];
}
}