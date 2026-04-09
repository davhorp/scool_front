import { Component, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {

  //private authService = inject(AuthService);
  //private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  // 1. DATOS FALSOS DEL USUARIO
  user = signal({
    id: 1025,
    nombre: 'Roberto Gómez Pérez',
    email: 'roberto.gomez@educontrol.com',
    rol: 'docente', // Puede ser 'admin', 'alumno' o 'tutor'
    fotoUrl: 'https://i.pravatar.cc/150?u=roberto', // Imagen aleatoria de prueba
    telefono: '+52 55 1234 5678',
    antiguedad: '3 años'
  });

  // Estado para el formulario de contraseña
  passwords = signal({
    current: '',
    new: '',
    confirm: ''
  });

  // Previsualización de la foto
  previewUrl = signal<string | null>(null);

  // 2. SIMULAR CARGA DE FOTO
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Creamos la URL temporal para ver el cambio en pantalla
      const localUrl = URL.createObjectURL(file);
      this.previewUrl.set(localUrl);
      
      console.log('Simulando subida de archivo...', file.name);
      // Aquí no llamamos a ningún servicio, solo fingimos éxito
    }
  }

  // 3. SIMULAR CAMBIO DE CONTRASEÑA
  updatePassword() {
    const p = this.passwords();
    
    if (p.new !== p.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Simulando cambio de contraseña en BD...');
    alert('¡Contraseña actualizada (Simulado)!');
    
    // Limpiamos los campos
    this.passwords.set({ current: '', new: '', confirm: '' });
  }
}
