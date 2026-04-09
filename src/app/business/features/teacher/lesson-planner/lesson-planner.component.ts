import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Lesson {
  id: number;
  dia: string;
  materia: string;
  tema: string;
  objetivo: string;
  materiales: string[];
  completado: boolean;
}

@Component({
  selector: 'app-lesson-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson-planner.component.html',
  styleUrl: './lesson-planner.component.css'
})
export class LessonPlannerComponent {

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  isModalOpen = signal(false);
  editingLesson = signal<Lesson | null>(null);
  
  // Plan de la semana (Datos de prueba)
  planSemanal = signal<Lesson[]>([
    { id: 1, dia: 'Lunes', materia: 'Matemáticas', tema: 'Ecuaciones de Segundo Grado', objetivo: 'Resolver x usando la fórmula general.', materiales: ['Calculadora', 'Guía PDF'], completado: true },
    { id: 2, dia: 'Martes', materia: 'Física', tema: 'Leyes de Newton', objetivo: 'Demostrar la inercia con experimentos simples.', materiales: ['Cronómetro', 'Pelotas de tenis'], completado: false },
    { id: 3, dia: 'Miércoles', materia: 'Matemáticas', tema: 'Factorización', objetivo: 'Identificar trinomios cuadrados perfectos.', materiales: ['Libro de Baldor'], completado: false }
  ]);

  // Filtrar lecciones por día
  getLessonsByDay(dia: string) {
    return this.planSemanal().filter(l => l.dia === dia);
  }

  toggleComplete(id: number) {
    this.planSemanal.update(plan => 
      plan.map(l => l.id === id ? { ...l, completado: !l.completado } : l)
    );
  }

  // Simulación de agregar nueva lección
  addLesson(dia: string) {
    const nueva: Lesson = {
      id: Date.now(),
      dia: dia,
      materia: 'Nueva Materia',
      tema: 'Nuevo Tema',
      objetivo: 'Definir objetivo...',
      materiales: [],
      completado: false
    };
    this.planSemanal.update(plan => [...plan, nueva]);
  }

  // Abrir el modal con una COPIA de la lección
  openEditModal(lesson: Lesson) {
    this.editingLesson.set({ ...lesson, materiales: [...lesson.materiales] }); 
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingLesson.set(null);
  }

  saveLesson() {
    const edited = this.editingLesson();
    if (edited) {
      this.planSemanal.update(plan => 
        plan.map(l => l.id === edited.id ? edited : l)
      );
      this.closeModal();
      // Aquí podrías disparar un Toast de "Cambios Guardados"
    }
  }

  // Utilidad para manejar los materiales como texto separado por comas en el input
  get materialsText(): string {
    return this.editingLesson()?.materiales.join(', ') || '';
  }

  setMaterialsText(value: string) {
    if (this.editingLesson()) {
      const array = value.split(',').map(m => m.trim()).filter(m => m !== '');
      this.editingLesson.update(l => l ? { ...l, materiales: array } : null);
    }
  }
  
}
