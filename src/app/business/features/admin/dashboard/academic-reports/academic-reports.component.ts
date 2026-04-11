import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface GroupStats {
  id: string;
  nombre: string;
  promedio: number;
  aprobacion: number; // Porcentaje
  materiaDificil: string;
}

@Component({
  selector: 'app-academic-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './academic-reports.component.html',
  styleUrls: ['./academic-reports.component.css']
})
export class AcademicReportsComponent {

  formulaIAE = 'Índice de Aprovechamiento Escolar (IAE) = Suma(Promedio de cada grupo * Número de alumnos en el grupo) / Total de alumnos';
  
  periodos = ['1er Trimestre', '2do Trimestre', '3er Trimestre', 'Final'];
  periodoSeleccionado = signal('1er Trimestre');

  // Datos crudos de grupos
  dataGrupos = signal<GroupStats[]>([
    { id: '1A', nombre: '1° A Secundaria', promedio: 8.7, aprobacion: 95, materiaDificil: 'Física' },
    { id: '2B', nombre: '2° B Secundaria', promedio: 7.4, aprobacion: 82, materiaDificil: 'Matemáticas' },
    { id: '3A', nombre: '3° A Secundaria', promedio: 9.1, aprobacion: 98, materiaDificil: 'Química' },
    { id: '1B', nombre: '1° B Secundaria', promedio: 6.8, aprobacion: 75, materiaDificil: 'Historia' }
  ]);

  // Ranking de los 5 mejores alumnos (Top Performers)
  topAlumnos = signal([
    { nombre: 'Sofía García', promedio: 9.9, grupo: '3° A' },
    { nombre: 'Mateo Pérez', promedio: 9.7, grupo: '1° A' },
    { nombre: 'Daniela Sosa', promedio: 9.5, grupo: '3° A' }
  ]);

  // Métricas calculadas
  promedioGlobal = computed(() => {
    const total = this.dataGrupos().reduce((acc, g) => acc + g.promedio, 0);
    return (total / this.dataGrupos().length).toFixed(1);
  });

  tasaAprobacionGlobal = computed(() => {
    const total = this.dataGrupos().reduce((acc, g) => acc + g.aprobacion, 0);
    return (total / this.dataGrupos().length).toFixed(0);
  });
}