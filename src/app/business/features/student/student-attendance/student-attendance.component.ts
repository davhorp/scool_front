import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AsistenciaMateria {
  id: string;
  nombre: string;
  profesor: string;
  clasesImpartidas: number;
  asistencias: number;
  faltas: number;
  retardos: number;
  limiteFaltas: number; // Faltas máximas permitidas antes de reprobar
}

interface RegistroReciente {
  id: number;
  fecha: string;
  materia: string;
  tipo: 'falta' | 'retardo';
  estado: 'injustificada' | 'justificada' | 'en_tramite';
}

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent {

  isJustificanteModalOpen = signal(false);
  isSubmittingJustificante = signal(false);
  
  // Datos simulados de materias
  materias = signal<AsistenciaMateria[]>([
    { id: 'MAT-301', nombre: 'Matemáticas Avanzadas', profesor: 'Ing. Roberto Ramos', clasesImpartidas: 40, asistencias: 38, faltas: 1, retardos: 1, limiteFaltas: 6 },
    { id: 'HIS-202', nombre: 'Historia Universal', profesor: 'Mtra. Lucía Méndez', clasesImpartidas: 25, asistencias: 20, faltas: 5, retardos: 0, limiteFaltas: 5 }, // ⚠️ En peligro
    { id: 'FIS-105', nombre: 'Física I', profesor: 'Lic. María Torres', clasesImpartidas: 30, asistencias: 28, faltas: 2, retardos: 0, limiteFaltas: 5 }
  ]);

  // Historial de las últimas incidencias
  historial = signal<RegistroReciente[]>([
    { id: 1, fecha: '10 Abril 2026', materia: 'Historia Universal', tipo: 'falta', estado: 'injustificada' },
    { id: 2, fecha: '05 Abril 2026', materia: 'Matemáticas Avanzadas', tipo: 'retardo', estado: 'justificada' }
  ]);

  // Lógica de cálculo enriquecida para la UI
  materiasProcesadas = computed(() => {
    return this.materias().map(mat => {
      const porcentaje = Math.round((mat.asistencias / mat.clasesImpartidas) * 100);
      const faltasRestantes = mat.limiteFaltas - mat.faltas;
      
      // Semáforo de riesgo
      let nivelRiesgo: 'seguro' | 'alerta' | 'peligro' = 'seguro';
      if (faltasRestantes <= 0) nivelRiesgo = 'peligro';
      else if (faltasRestantes <= 2) nivelRiesgo = 'alerta';

      return { ...mat, porcentaje, faltasRestantes, nivelRiesgo };
    });
  });

  // Cálculo Global para el Hero Banner
  porcentajeGlobal = computed(() => {
    const totalClases = this.materias().reduce((acc, curr) => acc + curr.clasesImpartidas, 0);
    const totalAsistencias = this.materias().reduce((acc, curr) => acc + curr.asistencias, 0);
    if (totalClases === 0) return 100;
    return Math.round((totalAsistencias / totalClases) * 100);
  });

  abrirModalJustificante() {
    this.isJustificanteModalOpen.set(true);
  }

  cerrarModalJustificante() {
    this.isJustificanteModalOpen.set(false);
  }

  enviarJustificante() {
    this.isSubmittingJustificante.set(true);

    // Simulamos la llamada al servidor (Backend Spring Boot)
    setTimeout(() => {
      this.isSubmittingJustificante.set(false);
      this.cerrarModalJustificante();
      
      // Opcional: Podrías actualizar el "historial" aquí para añadir un registro "en_tramite"
      console.log('✅ Justificante enviado a Control Escolar con éxito.');
      alert('Tu justificante ha sido enviado y está en revisión.');
    }, 1500);
  }
}