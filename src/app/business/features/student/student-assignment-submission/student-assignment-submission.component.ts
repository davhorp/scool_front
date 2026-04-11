import { Component, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tarea {
  id: string;
  titulo: string;
  materia: string;
  docente: string;
  fechaLimite: string;
  instrucciones: string;
  estado: 'pendiente' | 'entregada' | 'retrasada';
  valorPuntos: number;
}

@Component({
  selector: 'app-student-assignment-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-assignment-submission.component.html',
  styleUrl: './student-assignment-submission.component.css'
})
export class StudentAssignmentSubmissionComponent {

  id = input<string>();

  // Inicializa como null, esperando los datos del servidor
  tareaActual = signal<Tarea | null>(null);

  // Estado del formulario
  archivosSeleccionados = signal<File[]>([]);
  comentarioAlumno = signal('');
  isDragging = signal(false);
  isSubmitting = signal(false);

  // Computados para UI
  tiempoRestante = computed(() => {
    const tarea = this.tareaActual();
    
    // CORRECCIÓN 1: Validar que la tarea exista antes de calcular la fecha
    if (!tarea) return 'Cargando...'; 

    const limite = new Date(tarea.fechaLimite).getTime();
    const ahora = new Date().getTime();
    const diffDias = Math.ceil((limite - ahora) / (1000 * 60 * 60 * 24));
    
    if (diffDias < 0) return 'Fecha límite superada';
    if (diffDias === 0) return 'Vence hoy';
    return `Faltan ${diffDias} días`;
  });

  puedeEntregar = computed(() => this.archivosSeleccionados().length > 0);

  constructor() {
    effect(() => {
      const idTarea = this.id();
      if (idTarea) {
        this.cargarDatosDeLaTarea(idTarea);
      }
    });
  }

  // --- MÉTODOS DE ARCHIVOS ---
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.agregarArchivos(Array.from(input.files));
    }
  }

  cargarDatosDeLaTarea(id: string) {
    console.log(`🌐 Solicitando tarea ${id} al servidor...`);

    setTimeout(() => {
      const mockDatabase: Record<string, Tarea> = {
        'T-402': {
          id: 'T-402',
          titulo: 'Ensayo sobre la Revolución Industrial',
          materia: 'Historia Universal',
          docente: 'Mtra. Lucía Méndez',
          fechaLimite: '2026-04-15T23:59:00',
          instrucciones: 'Elabora un ensayo de mínimo 3 cuartillas analizando el impacto de la máquina de vapor en la economía europea del siglo XIX. Formato PDF obligatorio.',
          estado: 'pendiente',
          valorPuntos: 10
        },
        'T-105': {
          id: 'T-105',
          titulo: 'Problemario de Vectores',
          materia: 'Física I',
          docente: 'Lic. María Torres',
          fechaLimite: '2026-04-10T18:00:00',
          instrucciones: 'Resuelve los 15 problemas del capítulo 4. Muestra todo el procedimiento claramente.',
          estado: 'retrasada',
          valorPuntos: 20
        },
        'T-880': {
          id: 'T-880',
          titulo: 'Exposición Oral: El Quijote',
          materia: 'Literatura',
          docente: 'Mtra. Elena Paz',
          fechaLimite: '2026-04-20T10:00:00',
          instrucciones: 'Sube tu presentación de PowerPoint (.pptx) antes de tu turno de exposición.',
          estado: 'entregada',
          valorPuntos: 15
        }
      };

      const datosDescargados = mockDatabase[id] || {
        id: id,
        titulo: 'Tarea no encontrada',
        materia: 'Sistema',
        docente: 'Admin',
        fechaLimite: new Date().toISOString(),
        instrucciones: 'No se pudo localizar esta asignación. Por favor, contacta a tu profesor.',
        estado: 'pendiente',
        valorPuntos: 0
      };

      this.tareaActual.set(datosDescargados);
      console.log('✅ Datos cargados con éxito');

    }, 800);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.agregarArchivos(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  private agregarArchivos(archivos: File[]) {
    this.archivosSeleccionados.update(actuales => [...actuales, ...archivos]);
  }

  removerArchivo(index: number) {
    this.archivosSeleccionados.update(actuales => actuales.filter((_, i) => i !== index));
  }

  // --- ENVÍO ---
  entregarTarea() {
    if (!this.puedeEntregar()) return;

    this.isSubmitting.set(true);

    setTimeout(() => {
      // CORRECCIÓN 2: Validamos si 't' existe antes de actualizarlo
      this.tareaActual.update(t => t ? { ...t, estado: 'entregada' } : null);
      
      this.isSubmitting.set(false);
    }, 1500);
  }
}