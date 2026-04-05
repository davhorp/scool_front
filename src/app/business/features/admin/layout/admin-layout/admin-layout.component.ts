import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';
import { StudenFileComponent } from '../../dashboard/studenFile/studen-file/studen-file.component';
import { AuthService } from '../../../../../core/services/auth.service';

interface StudentFile {
  id: string;
  nombre: string;
  grado: string;
  estado: 'activo' | 'egresado' | 'moroso';
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    FormsModule,
    StudenFileComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  selectedStudent = signal<StudentFile | null>(null);

  // El término de búsqueda es un signal
  searchTerm = signal('');

  isCollapsed = signal(false);

  menuItems = [
    { path: 'dashboard', icon: '📊', label: 'Dashboard' },
    { path: 'usuarios', icon: '👥', label: 'Usuarios' },
    { path: 'inscripciones', icon: '📝', label: 'Inscripciones' },
    { path: 'reportes-financieros', icon: '💰', label: 'Finanzas' },
    { path: 'configuracion', icon: '⚙️', label: 'Ajustes' },
    { path: 'configuracion', icon: '⚙️', label: 'Ajustes' }
  ];

  // Base de datos simulada (En producción vendría de un Servicio)
  students = signal<StudentFile[]>([
    { id: '2024-001', nombre: 'Ana García', grado: '3° Primaria', estado: 'activo' },
    { id: '2024-042', nombre: 'Carlos López', grado: '1° Secundaria', estado: 'moroso' },
    { id: '2023-115', nombre: 'Beatriz Ortiz', grado: '2° Preparatoria', estado: 'activo' },
    { id: '2024-089', nombre: 'Daniel Sosa', grado: '3° Primaria', estado: 'activo' }
  ]);

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  // Filtro inteligente reactivo
  filteredResults = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (term.length < 2) return []; // No buscar si hay menos de 2 letras
    
    return this.students().filter(s => 
      s.nombre.toLowerCase().includes(term) || s.id.includes(term)
    ).slice(0, 5); // Limitar a 5 resultados para no saturar la vista
  });

  openFile(student: StudentFile) {
    this.selectedStudent.set(student); // Guardamos al alumno seleccionado
    this.searchTerm.set('');
    this.toastService.show(
      'Expediente Abierto', 
      `Visualizando datos de ${student.nombre}`, 
      'info'
    );
  }

  closeFile() {
    this.selectedStudent.set(null); // Volvemos a la vista general (Dashboard)
  }

  logout(): void {
    // Mostramos un aviso rápido antes de salir
    this.toastService.show(
      'Sesión Finalizada', 
      'Has salido del sistema de forma segura.', 
      'info'
    );
    // Ejecutamos el cierre de sesión tras un breve delay 
    // para que el usuario vea la notificación
    setTimeout(() => {
      this.authService.logout();
    }, 1000);
  }
  
}
