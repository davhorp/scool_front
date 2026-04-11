import { Component, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Publicacion {
  id: string;
  tipo: 'aviso' | 'material' | 'tarea';
  titulo: string;
  contenido: string;
  fecha: string;
  autor: string;
  archivoAdjunto?: string;
}

interface DatosAula {
  id: string;
  nombre: string;
  docente: string;
  color: string;
  portadaUrl: string;
  publicaciones: Publicacion[];
  tareasProximas: any[];
  modulosTrabajo: Unidad[];
  alumnosInscritos: AlumnoInscrito[];
}

interface AlumnoInscrito {
  id: string;
  matricula: string;
  nombre: string;
  correo: string;
  avatarUrl?: string; // Opcional
  estado: 'activo' | 'baja' | 'condicionado';
}
// --- NUEVAS INTERFACES ---
interface ItemTrabajo {
  id: string;
  tipo: 'tarea' | 'material' | 'cuestionario';
  titulo: string;
  fechaLimite?: string;
  estado?: 'pendiente' | 'entregada' | 'calificada' | 'retrasada';
  calificacion?: number;
}

interface Unidad {
  id: string;
  titulo: string;
  descripcion: string;
  items: ItemTrabajo[];
}

@Component({
  selector: 'app-student-classroom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-classroom.component.html',
  styleUrl: './student-classroom.component.css'
})
export class StudentClassroomComponent {

  // 1. Recibe el ID de la URL (ej. MAT-301)
  id = input<string>();

  // 2. Estado de la vista
  aula = signal<DatosAula | null>(null);
  tabActiva = signal<'muro' | 'trabajo' | 'personas'>('muro');
  isLoading = signal(true);

  constructor() {
    effect(() => {
      const idAula = this.id();
      console.log('El ID detectado en la URL es:', idAula);
      if (idAula) {
        this.cargarAula(idAula);
      } else {
        console.error('⚠️ Angular no detectó ningún ID en la URL.');
      }
    }, { allowSignalWrites: true });
  }

  cargarAula(id: string) {
    this.isLoading.set(true);
    console.log(`🌐 Entrando al aula virtual: ${id}...`);

    setTimeout(() => {
      // Simulamos la respuesta del backend
      const mockAula: DatosAula = {
        id: id,
        nombre: id === 'MAT-301' ? 'Matemáticas Avanzadas' : 'Historia Universal',
        docente: id === 'MAT-301' ? 'Ing. Roberto Ramos' : 'Mtra. Lucía Méndez',
        color: id === 'MAT-301' ? '#3b82f6' : '#10b981',
        portadaUrl: 'https://www.transparenttextures.com/patterns/cubes.png', // Textura sutil
        publicaciones: [
          {
            id: 'PUB-1',
            tipo: 'aviso',
            titulo: '¡Bienvenidos al nuevo ciclo!',
            contenido: 'Espero que vengan con mucha energía. Por favor revisen el temario adjunto en la sección de trabajos.',
            fecha: 'Hace 2 horas',
            autor: 'Profesor'
          },
          {
            id: 'PUB-2',
            tipo: 'material',
            titulo: 'Diapositivas: Unidad 1',
            contenido: 'Aquí les dejo la presentación que vimos en clase hoy.',
            fecha: 'Ayer',
            autor: 'Profesor',
            archivoAdjunto: 'Presentacion_U1.pdf'
          }
        ],
        tareasProximas: [
          { id: 'T-402', titulo: 'Ensayo Inicial', vencimiento: 'Mañana', idMateria: id }
        ],
        modulosTrabajo: [
  {
    id: 'U1',
    titulo: 'Unidad 1: Introducción',
    descripcion: 'Conceptos básicos y fundamentos del temario.',
    items: [
      {
        id: 'M-101',
        tipo: 'material',
        titulo: 'Syllabus y Reglas de Clase',
      },
      {
        id: 'T-880', // Coincide con el mock que hicimos antes en entregas
        tipo: 'tarea',
        titulo: 'Exposición Oral: El Quijote',
        fechaLimite: '2026-04-20T10:00:00',
        estado: 'entregada',
        calificacion: 15
      }
    ]
  },
  {
    id: 'U2',
    titulo: 'Unidad 2: Desarrollo Temático',
    descripcion: 'Análisis profundo de los casos de estudio.',
    items: [
      {
        id: 'M-102',
        tipo: 'material',
        titulo: 'Lectura: Capítulo 4 y 5',
      },
      {
        id: 'T-402', // Coincide con el mock de entrega pendiente
        tipo: 'tarea',
        titulo: 'Ensayo sobre la Revolución Industrial',
        fechaLimite: '2026-04-15T23:59:00',
        estado: 'pendiente'
      },
      {
        id: 'Q-201',
        tipo: 'cuestionario',
        titulo: 'Quiz Rápido: Conceptos de la U2',
        fechaLimite: '2026-04-18T18:00:00',
        estado: 'pendiente'
      }
    ]
  }
],
alumnosInscritos: [
  { 
    id: 'A-001', 
    matricula: '20260010', 
    nombre: 'Sofía Martínez', 
    correo: 'smartinez@educore.edu.mx',
    estado: 'activo'
  },
  { 
    id: 'A-002', 
    matricula: '20260015', 
    nombre: 'Alejandro Gómez', 
    correo: 'agomez@educore.edu.mx',
    estado: 'activo'
  },
  { 
    id: 'A-003', 
    matricula: '20260022', 
    nombre: 'Valeria Rojas', 
    correo: 'vrojas@educore.edu.mx', 
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    estado: 'activo'
  },
  { 
    id: 'A-004', 
    matricula: '20260089', 
    nombre: 'Diego Fernández', 
    correo: 'dfernandez@educore.edu.mx',
    estado: 'condicionado' // Útil para mostrar alertas visuales si fuera la vista de admin
  }
]
      };

      this.aula.set(mockAula);
      this.isLoading.set(false);
    }, 600);
  }

  cambiarTab(tab: 'muro' | 'trabajo' | 'personas') {
    this.tabActiva.set(tab);
  }

}
