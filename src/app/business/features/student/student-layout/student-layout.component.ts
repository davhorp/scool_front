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

  isMenuOpen = signal(true);

  menuItems = [
    { path: 'dashboard', icon: '🏠', label: 'Inicio' },
    { path: 'calificaciones', icon: '📈', label: 'Mis Notas' },
    { path: 'horario', icon: '📅', label: 'Mi Horario' },
    { path: 'pagos', icon: '💳', label: 'Pagos y Becas' }
  ];

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

}
