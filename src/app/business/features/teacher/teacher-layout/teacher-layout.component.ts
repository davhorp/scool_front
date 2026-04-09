import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, RouterOutlet, RouterModule],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.css'
})
export class TeacherLayoutComponent {

   public nameFullUsr : string | null = localStorage.getItem('nameFullUsr');
  public profileUsr : string | null = localStorage.getItem('profileUsr');

  private authService = inject(AuthService);
    private toastService = inject(ToastService);

  // Estado de la navegación
  activeSection = signal('dashboard'); // dashboard, students, grades, attendance, messages
  isSidebarCollapsed = signal(false);

  menuItems = [
    { path: 'dashboard', label: 'Inicio', icon: '🏠' },
    { path: 'students', label: 'Mis Alumnos', icon: '👥' },
    { path: 'grades', label: 'Calificaciones', icon: '📝' },
    { path: 'lesson-planner', label: 'Planificador de Clases', icon: '📅' },
    { path: 'registrar-conducta', icon: '📝', label: 'Reporte Conductual' },
    { path: 'attendance', label: 'Asistencia', icon: '📅' },
    { path: 'messages', label: 'Mensajería', icon: '✉️' },
    { path: 'settings', label: 'Configuración', icon: '⚙️' }
  ];

  // --- LÓGICA DE BÚSQUEDA GLOBAL ---
  searchTerm = signal('');

  // Base de datos "mock" (Debería venir de tu servicio/backend)
  private allStudents = [
    { id: '2024001', nombre: 'Juan Pérez', grado: '3° A', estado: 'Activo' },
    { id: '2024002', nombre: 'Lucía Gómez', grado: '3° B', estado: 'Activo' },
    { id: '2024003', nombre: 'Carlos Ruiz', grado: '1° A', estado: 'Baja' }
  ];

  // Esto se recalcula automáticamente cuando escribes en el input
  filteredResults = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    
    if (term.length < 2) return []; // No busca si hay menos de 2 letras
    

    return this.allStudents.filter(student => 
      student.nombre.toLowerCase().includes(term) || 
      student.id.includes(term)
    );
  });

  openFile(student: any) {
    console.log('Abriendo expediente de:', student.nombre);
    
    // Aquí puedes usar el Router para navegar al expediente:
    // this.router.navigate(['/teacher/students', student.id]);
    
    // Limpiamos la búsqueda después de hacer clic
    this.searchTerm.set(''); 
  }

  setSection(section: string) {
    this.activeSection.set(section);
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
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
