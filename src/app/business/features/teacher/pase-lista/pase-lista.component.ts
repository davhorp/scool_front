import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type EstadoAsistencia = 'presente' | 'retardo' | 'falta' | null;

interface AlumnoLista {
  id: number;
  nombre: string;
  matricula: string;
  foto: string;
  estado: EstadoAsistencia;
}

@Component({
  selector: 'app-pase-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pase-lista.component.html',
  styleUrl: './pase-lista.component.css'
})
export class PaseListaComponent {

  // Obtener fecha en formato YYYY-MM-DD para el input type="date"
  fechaHoy = signal(new Date().toISOString().split('T')[0]);

  listaAlumnos = signal<AlumnoLista[]>([
    { id: 1, nombre: 'Ana López', matricula: '2024-001', foto: 'https://ui-avatars.com/api/?name=Ana+L&background=random', estado: null },
    { id: 2, nombre: 'Carlos Ruiz', matricula: '2024-002', foto: 'https://ui-avatars.com/api/?name=Carlos+R&background=random', estado: null },
    { id: 3, nombre: 'Elena Gómez', matricula: '2024-003', foto: 'https://ui-avatars.com/api/?name=Elena+G&background=random', estado: null },
    { id: 4, nombre: 'Javier Silva', matricula: '2024-004', foto: 'https://ui-avatars.com/api/?name=Javier+S&background=random', estado: null },
  ]);

  // Propiedades calculadas dinámicamente (se actualizan solas cuando cambias un estado)
  conteo = computed(() => {
    const alumnos = this.listaAlumnos();
    return {
      presentes: alumnos.filter(a => a.estado === 'presente').length,
      retardos: alumnos.filter(a => a.estado === 'retardo').length,
      faltas: alumnos.filter(a => a.estado === 'falta').length,
    };
  });

  alumnosMarcados = computed(() => {
    return this.listaAlumnos().filter(a => a.estado !== null).length;
  });

  // Método para marcar asistencia
  marcar(idAlumno: number, nuevoEstado: EstadoAsistencia) {
    this.listaAlumnos.update(alumnos => 
      alumnos.map(alumno => 
        alumno.id === idAlumno 
          // Si hace clic en el mismo que ya está activo, lo desmarca (vuelve a null)
          ? { ...alumno, estado: alumno.estado === nuevoEstado ? null : nuevoEstado } 
          : alumno
      )
    );
  }

  guardarLista() {
    const dataParaBackend = this.listaAlumnos().map(a => ({
      alumno_id: a.id,
      estado: a.estado
    }));
    
    console.log('Guardando en Base de Datos...', dataParaBackend);
    alert('¡Asistencia guardada correctamente!');
  }

}
