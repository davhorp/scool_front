import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend: number; // Porcentaje de cambio
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private toastService = inject(ToastService);
   // Signal para controlar el modal
  isModalOpen = signal(false);

  // Datos temporales del formulario
  newStudent = { nombre: '', grado: '1' };

  // Signals para datos reactivos
  stats = signal<StatCard[]>([
    { label: 'Estudiantes', value: 1250, icon: '🎓', trend: 12, color: '#3498db' },
    { label: 'Docentes', value: 48, icon: '👨‍🏫', trend: 2, color: '#9b59b6' },
    { label: 'Pagos Pendientes', value: '$3,420', icon: '⚠️', trend: -5, color: '#e67e22' },
    { label: 'Asistencia Hoy', value: '94%', icon: '📅', trend: 0.5, color: '#2ecc71' }
  ]);

  recentActivities = signal([
    { user: 'Admin', action: 'Inscribió a nuevo alumno', time: 'Hace 5 min', type: 'info' },
    { user: 'Sec. Académica', action: 'Subió reporte de notas', time: 'Hace 20 min', type: 'success' },
    { user: 'Soporte', action: 'Actualización de sistema', time: 'Hace 1 hora', type: 'warning' }
  ]);

  ngOnInit() {
    this.toastService.show('Dashboard Listo', 'Datos actualizados del ciclo escolar 2026', 'info');
  }

  refreshData() {
    this.toastService.show('Sincronizando', 'Obteniendo datos del servidor...', 'info', 2000);
    // Lógica para recargar datos...
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.newStudent = { nombre: '', grado: '1' }; // Limpiar
  }

  saveStudent() {
    if (!this.newStudent.nombre) {
      this.toastService.show('Error', 'El nombre es obligatorio', 'error');
      return;
    }

    // Simulación de guardado
    this.toastService.show(
      'Alumno Registrado', 
      `${this.newStudent.nombre} ha sido inscrito en ${this.newStudent.grado}° Año`, 
      'success'
    );
    
    this.closeModal();
  }

}
