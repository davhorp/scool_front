import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DatosTutor {
  nombre: string;
  parentesco: string;
  telefono: string;
  correo: string;
}

interface PerfilAlumno {
  id: string;
  matricula: string;
  nombre: string;
  apellidos: string;
  curp: string;
  fechaNacimiento: string;
  correoInstitucional: string;
  grado: string;
  grupo: string;
  turno: string;
  campus: string;
  tutor: DatosTutor;
}

@Component({
  selector: 'app-student-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-config.component.html',
  styleUrl: './student-config.component.css'
})
export class StudentConfigComponent {

  // Estado de la foto de perfil (Signal independiente)
  fotoPerfilUrl = signal<string>('https://i.pravatar.cc/300?img=47');
  isUploading = signal(false);

  // Datos de solo lectura del estudiante
  perfil = signal<PerfilAlumno>({
    id: 'A-001',
    matricula: '20260010',
    nombre: 'Sofía',
    apellidos: 'Martínez López',
    curp: 'MALS080512MDFRXX09',
    fechaNacimiento: '12 de Mayo de 2008',
    correoInstitucional: 'smartinez@educore.edu.mx',
    grado: '3° Semestre',
    grupo: 'A',
    turno: 'Matutino',
    campus: 'Campus Central',
    tutor: {
      nombre: 'Alejandro Martínez Ruiz',
      parentesco: 'Padre',
      telefono: '+52 55 1234 5678',
      correo: 'amartinez.padre@gmail.com'
    }
  });

  // --- MÉTODOS PARA CAMBIAR LA FOTO ---
  onFotoSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];
      
      // Validación básica (Max 2MB y solo imágenes)
      if (archivo.size > 2 * 1024 * 1024) {
        alert('La imagen es muy grande. El máximo permitido es 2MB.');
        return;
      }

      this.isUploading.set(true);

      // Usamos FileReader para mostrar la imagen instantáneamente
      const reader = new FileReader();
      reader.onload = (e) => {
        // Simulamos la carga al servidor con un setTimeout
        setTimeout(() => {
          this.fotoPerfilUrl.set(e.target?.result as string);
          this.isUploading.set(false);
          console.log('✅ Foto subida exitosamente al servidor.');
        }, 1200);
      };
      reader.readAsDataURL(archivo);
    }
  }

  eliminarFoto() {
    if (confirm('¿Estás seguro de eliminar tu foto de perfil?')) {
      this.fotoPerfilUrl.set(''); // Dejará un placeholder con la inicial
    }
  }

}
