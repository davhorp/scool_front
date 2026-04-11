import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})
export class StudentLayoutComponent {

  public nameFullUsr : string | null = localStorage.getItem('nameFullUsr');
  public profileUsr : string | null = localStorage.getItem('profileUsr');


  isMenuOpen = signal(true);

  menuItems = [
    { path: 'dashboard', icon: '🏠', label: 'Inicio' },
    { path: 'calificaciones', icon: '📈', label: 'Mis Notas' },
    { path: 'horario', icon: '📅', label: 'Mi Horario' },
    { path: 'materias', icon: '📚', label: 'Mis Materias', group: 'academico' },
  { path: 'asistencia', icon: '✅', label: 'Asistencia', group: 'academico' },
  
  // BLOQUE: PERFIL E INSTITUCIONAL
  { path: 'avisos', icon: '📢', label: 'Comunicados', badge: 1, group: 'perfil' },
  { path: 'tramites', icon: '📄', label: 'Trámites', group: 'perfil' },
  { path: 'configuracion', icon: '⚙️', label: 'Mi Perfil', group: 'perfil' }
    //,
    //{ path: 'pagos', icon: '💳', label: 'Pagos y Becas' }
  ];

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  // Controla la pestaña activa en la barra inferior
  tabActivo = signal<'inicio' | 'horario' | 'tareas' | 'mas'>('inicio');

  cambiarTab(tab: 'inicio' | 'horario' | 'tareas' | 'mas') {
    this.tabActivo.set(tab);
    // Aquí puedes agregar la lógica de enrutamiento (ej. this.router.navigate([...]))
  }

}
