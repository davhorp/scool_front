import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface Materia {
  id: string;
  nombre: string;
  docente: string;
  color: string;
  progreso: number; // Porcentaje de avance del temario
  recursosNuevos: number; // Archivos o PDFs sin leer
  horarioResumen: string;
}

@Component({
  selector: 'app-student-subjects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-subjects.component.html',
  styleUrls: ['./student-subjects.component.css']
})
export class StudentSubjectsComponent {

  private router = inject(Router);
  
  // Ciclo escolar actual
  cicloEscolar = signal('Ciclo 2026 - Semestre B');

  // Datos simulados de las materias
  materias = signal<Materia[]>([
    {
      id: 'MAT-301',
      nombre: 'Matemáticas Avanzadas',
      docente: 'Ing. Roberto Ramos',
      color: '#3b82f6', // Azul
      progreso: 65,
      recursosNuevos: 2,
      horarioResumen: 'Lun, Mié, Vie • 07:00'
    },
    {
      id: 'HIS-202',
      nombre: 'Historia Universal',
      docente: 'Mtra. Lucía Méndez',
      color: '#10b981', // Verde
      progreso: 40,
      recursosNuevos: 0,
      horarioResumen: 'Mar, Jue • 10:40'
    },
    {
      id: 'FIS-105',
      nombre: 'Física I',
      docente: 'Lic. María Torres',
      color: '#f59e0b', // Naranja
      progreso: 78,
      recursosNuevos: 5, // Llama la atención
      horarioResumen: 'Lun, Mar, Jue • 09:00'
    },
    {
      id: 'LIT-404',
      nombre: 'Literatura Contemporánea',
      docente: 'Mtra. Elena Paz',
      color: '#8b5cf6', // Morado
      progreso: 90,
      recursosNuevos: 1,
      horarioResumen: 'Mié, Vie • 11:30'
    }
  ]);

  // Cálculo computado para mostrar un resumen en la cabecera
  totalRecursosNuevos = computed(() => {
    return this.materias().reduce((total, mat) => total + mat.recursosNuevos, 0);
  });

  entrarAlAula(idMateria: string) {
    console.log(`Guardando registro de acceso para la materia: ${idMateria}...`);
    
    // Aquí viajas a la ruta
    this.router.navigate(['/alumno/materia', idMateria]);
  }
}