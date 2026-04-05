import { CommonModule } from '@angular/common';
import { Component, input, signal, inject } from '@angular/core';
import { ToastService } from '../../../../../../core/services/toast.service';

type TabType = 'academico' | 'asistencia' | 'pagos';

@Component({
  selector: 'app-studen-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './studen-file.component.html',
  styleUrl: './studen-file.component.css'
})
export class StudenFileComponent {

  private toastService = inject(ToastService);

  today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Signal para el estado de carga
  isGenerating = signal(false);

  // Recibimos el alumno como input (viniendo de la búsqueda)
  student = input.required<any>();
  
  // Estado de la pestaña activa
  activeTab = signal<TabType>('academico');

  // Datos simulados (Esto vendría de un StudentService)
  grades = signal([
    { materia: 'Matemáticas', nota: 9.5, periodo: '1er Trimestre' },
    { materia: 'Lengua', nota: 8.0, periodo: '1er Trimestre' },
    { materia: 'Historia', nota: 7.5, periodo: '1er Trimestre' }
  ]);

  payments = signal([
    { concepto: 'Matrícula Marzo', monto: 150, fecha: '05/03/2026', estado: 'pagado' },
    { concepto: 'Cuota Abril', monto: 120, fecha: '02/04/2026', estado: 'pendiente' }
  ]);

  changeTab(tab: TabType) {
    this.activeTab.set(tab);
  }

  generatePDF() {
  this.isGenerating.set(true);
  this.toastService.show('Preparando Documento', 'Optimizando formato para impresión...', 'info', 1500);

  // Damos un pequeño respiro para que el usuario vea el estado de "Generando"
  setTimeout(() => {
    this.isGenerating.set(false);
    
    // Dispara el diálogo de impresión del navegador
    window.print(); 
    
    this.toastService.show('Impresión finalizada', 'Proceso completado correctamente', 'success');
  }, 1000);
}

}
