import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-teacher-behavior-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-behavior-form.component.html',
  styleUrl: './teacher-behavior-form.component.css'
})
export class TeacherBehaviorFormComponent {

  private toastService = inject(ToastService);

  // Lista de alumnos de la clase actual (viniendo de un servicio)
  students = signal([
    { id: 1, nombre: 'Lucía Pérez' },
    { id: 2, nombre: 'Mateo Pérez' },
    { id: 3, nombre: 'Daniela Sosa' }
  ]);

  // Estado del formulario
  formData = signal({
    studentId: null as number | null,
    type: 'positivo' as 'positivo' | 'observacion' | 'incidencia',
    points: 5,
    comment: '',
    notifyImmediate: false
  });

  submitReport() {
    const data = this.formData();
    
    if (!data.studentId || !data.comment) {
      this.toastService.show('Campos incompletos', 'Por favor selecciona un alumno y escribe un comentario.', 'warning');
      return;
    }

    // Simulación de POST /api/behavior-reports
    console.log('Enviando reporte:', data);
    
    this.toastService.show(
      'Reporte Guardado', 
      data.notifyImmediate ? 'El tutor ha sido notificado por la App.' : 'Registro guardado en la bitácora.',
      'success'
    );

    // Limpiar formulario
    this.formData.set({
      studentId: null,
      type: 'positivo',
      points: 5,
      comment: '',
      notifyImmediate: false
    });
  }

}
