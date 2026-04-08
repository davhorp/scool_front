import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, RouterOutlet],
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
    { path: 'attendance', label: 'Asistencia', icon: '📅' },
    { path: 'messages', label: 'Mensajería', icon: '✉️' },
    { path: 'settings', label: 'Configuración', icon: '⚙️' }
  ];

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
