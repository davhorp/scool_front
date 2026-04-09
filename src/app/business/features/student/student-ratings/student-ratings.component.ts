import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SubjectGrade {
  materia: string;
  p1: number;
  p2: number;
  p3: number;
  docente: string;
}

@Component({
  selector: 'app-student-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-ratings.component.html',
  styleUrl: './student-ratings.component.css'
})
export class StudentRatingsComponent {

  studentName = signal('Juan Pérez');
    
    // Datos que vienen del backend (las notas que cargó el docente)
    myGrades = signal<SubjectGrade[]>([
      { materia: 'Matemáticas III', p1: 9.0, p2: 8.5, p3: 0, docente: 'Roberto Gómez' },
      { materia: 'Historia Universal', p1: 7.0, p2: 7.5, p3: 0, docente: 'Lucía Fernández' },
      { materia: 'Física I', p1: 5.5, p2: 6.0, p3: 0, docente: 'Marcos Rivas' }
    ]);
  
    // Promedio General actual
    gpa = computed(() => {
      const grades = this.myGrades();
      const sum = grades.reduce((acc, g) => (g.p1 + g.p2 + (g.p3 || 0)) / 3, 0);
      return (sum / grades.length).toFixed(1);
    });
  
    // Alerta de riesgo
    riskSubjects = computed(() => 
      this.myGrades().filter(g => (g.p1 + g.p2) / 2 < 6)
    );

}
