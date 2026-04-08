import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definición de interfaces para tipado fuerte
interface HistorialNota {
  mes: string;
  nota: number;
}

interface Alumno {
  id: number;
  nombre: string;
  tutor: string;
  promedio: number;
  asistencia: number; // Porcentaje
  tareasEntregadas: number; // Porcentaje
  estado: 'Regular' | 'Riesgo' | 'Excelente';
  historial: HistorialNota[];
}

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-students.component.html',
  styleUrl: './teacher-students.component.css'
})
export class TeacherStudentsComponent implements OnInit {

  // Tu lista de estudiantes (Signal)
  studentsList = signal([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', grado: '3° A', promedio: 8.5, status: 'active' },
    // ... más datos
  ]);
  
  // --- SIGNALS DE ESTADO ---
  
  // 1. Buscador
  searchQuery = signal<string>('');

  // 2. Alumno seleccionado para el expediente (Master-Detail)
  alumnoSeleccionado = signal<Alumno | null>(null);

  // 3. Fuente de datos (Mock Data)
  // En producción, esto vendría de un Servicio inyectado (HttpClient)
  alumnos = signal<Alumno[]>([
    {
      id: 1,
      nombre: 'Ana García',
      tutor: 'Laura García',
      promedio: 9.4,
      asistencia: 98,
      tareasEntregadas: 100,
      estado: 'Excelente',
      historial: [
        { mes: 'Ene', nota: 9.0 },
        { mes: 'Feb', nota: 9.2 },
        { mes: 'Mar', nota: 9.5 },
        { mes: 'Abr', nota: 9.4 }
      ]
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      tutor: 'Pedro Ruiz',
      promedio: 6.8,
      asistencia: 75,
      tareasEntregadas: 45,
      estado: 'Riesgo',
      historial: [
        { mes: 'Ene', nota: 7.5 },
        { mes: 'Feb', nota: 7.0 },
        { mes: 'Mar', nota: 6.5 },
        { mes: 'Abr', nota: 6.8 }
      ]
    },
    {
      id: 3,
      nombre: 'Elena Sosa',
      tutor: 'Miguel Sosa',
      promedio: 8.2,
      asistencia: 90,
      tareasEntregadas: 85,
      estado: 'Regular',
      historial: [
        { mes: 'Ene', nota: 8.0 },
        { mes: 'Feb', nota: 8.5 },
        { mes: 'Mar', nota: 8.1 },
        { mes: 'Abr', nota: 8.2 }
      ]
    }
  ]);

  // --- COMPUTED PROPERTIES (Reactividad Automática) ---

  // Filtra la lista de la izquierda según el buscador
  alumnosFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.alumnos().filter(a => 
      a.nombre.toLowerCase().includes(query) || 
      a.tutor.toLowerCase().includes(query)
    );
  });

  // Extrae el historial del alumno seleccionado para la gráfica de barras
  historialRendimiento = computed(() => {
    return this.alumnoSeleccionado()?.historial || [];
  });

  ngOnInit(): void {
    // Opcional: Seleccionar al primer alumno por defecto al cargar
    if (this.alumnos().length > 0) {
      this.alumnoSeleccionado.set(this.alumnos()[0]);
    }
  }

  // --- MÉTODOS DE ACCIÓN ---

  seleccionarAlumno(alumno: Alumno): void {
    this.alumnoSeleccionado.set(alumno);
  }

  notificarTutor(alumno: Alumno): void {
    console.log(`Abriendo canal de comunicación con ${alumno.tutor}...`);
    // Aquí podrías disparar el modal de mensajes que creamos previamente
    alert(`Se ha generado una notificación para el tutor de ${alumno.nombre}`);
  }

  actualizarNota(alumnoId: number, nuevaNota: number): void {
    this.alumnos.update(lista => lista.map(a => {
      if (a.id === alumnoId) {
        return { ...a, promedio: nuevaNota };
      }
      return a;
    }));
  }

  // --- AQUÍ VA EL MÉTODO ---
  addStudent() {
    console.log('Abriendo formulario para añadir estudiante...');
    
    // Opción A: Navegar a una ruta de formulario
    // this.router.navigate(['/teacher/students/new']);

    // Opción B: Abrir un modal (Cambiando una señal de control)
    // this.isAddModalOpen.set(true);

    // Ejemplo rápido: Añadir uno de prueba para ver que funciona
    const newStudent = {
      id: Date.now(),
      nombre: 'Nuevo Alumno',
      email: 'nuevo@educontrol.com',
      grado: '3° A',
      promedio: 0,
      status: 'active'
    };

    this.studentsList.update(students => [...students, newStudent]);
  }
}
