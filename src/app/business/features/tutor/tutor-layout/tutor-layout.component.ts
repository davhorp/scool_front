import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../core/services/notifications/notificacion.service';

@Component({
  selector: 'app-tutor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tutor-layout.component.html',
  styleUrl: './tutor-layout.component.css'
})
export class TutorLayoutComponent {

  notifService = inject(NotificacionService);

  isMenuOpen = signal(true);

  // 2. Definimos el Signal para controlar la visibilidad del panel
  showNotifPanel = signal(false);

  menuItems = [
    { path: 'dashboard', icon: '🏠', label: 'Inicio' },
    { path: 'hijos', icon: '🧒', label: 'Mis Hijos' },
    { path: 'reporte-conductual', icon: '⚖️', label: 'Conducta' },
    { path: 'pagos-familia', icon: '💳', label: 'Estado de Cuenta' },
    { path: 'circulares', icon: '📢', label: 'Comunicados' },
    { path: 'perfil', icon: '⚙️', label: 'Mi Cuenta' }
  ];

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  // 3. El método para abrir/cerrar el panel
  toggleNotifPanel() {
    this.showNotifPanel.update(visible => !visible);
    
    // Opcional: Si quieres que al abrir el panel se marquen como leídas 
    // después de 2 segundos de estar abierto:
    /*
    if (this.showNotifPanel()) {
      setTimeout(() => this.notifService.marcarComoLeidas(), 2000);
    }
    */
  }

}
