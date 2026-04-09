import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definimos una interfaz básica para la estructura de datos
interface Materia {
  nombre: string;
  nota: number;
}

interface Observacion {
  id: number;
  profesor: string;
  fecha: string;
  texto: string;
}

interface Hijo {
  id: number;
  nombre: string;
  foto: string;
  grado: string;
  matricula: string;
  presenteHoy: boolean;
  pagoAtrasado: boolean;
  proximoPagoMonto: number;
  proximoPagoFecha: string;
  asistencia: {
    porcentaje: number;
    faltas: number;
  };
  materias: Materia[];
  observaciones: Observacion[];
}

@Component({
  selector: 'app-hijo-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hijo-detalle.component.html',
  styleUrl: './hijo-detalle.component.css'
})
export class HijoDetalleComponent {

  // 1. Listado de hijos vinculados al tutor (Mock Data)
  hijos = signal<Hijo[]>([
    {
      id: 1,
      nombre: 'Santiago Pérez',
      foto: 'https://ui-avatars.com/api/?name=Santiago+Perez&background=4f46e5&color=fff',
      grado: '3° A - Primaria',
      matricula: 'EDU-2024-0015',
      presenteHoy: true,
      pagoAtrasado: false,
      proximoPagoMonto: 4500,
      proximoPagoFecha: '15 de Mayo, 2026',
      asistencia: { porcentaje: 95, faltas: 2 },
      materias: [
        { nombre: 'Matemáticas', nota: 9.5 },
        { nombre: 'Ciencias Naturales', nota: 8.8 },
        { nombre: 'Historia', nota: 7.5 },
        { nombre: 'Lengua Española', nota: 10 }
      ],
      observaciones: [
        { id: 101, profesor: 'Prof. Davhorp', fecha: '12 Abr', texto: 'Excelente participación en el proyecto de geometría.' },
        { id: 102, profesor: 'Miss Elena', fecha: '08 Abr', texto: 'Cumple puntualmente con todas sus tareas.' }
      ]
    },
    {
      id: 2,
      nombre: 'Lucía Pérez',
      foto: 'https://ui-avatars.com/api/?name=Lucia+Perez&background=ec4899&color=fff',
      grado: '1° B - Primaria',
      matricula: 'EDU-2026-0082',
      presenteHoy: false,
      pagoAtrasado: true,
      proximoPagoMonto: 4500,
      proximoPagoFecha: '01 de Mayo, 2026',
      asistencia: { porcentaje: 82, faltas: 5 },
      materias: [
        { nombre: 'Matemáticas', nota: 7.2 },
        { nombre: 'Artes Visuales', nota: 10 },
        { nombre: 'Educación Física', nota: 9.0 }
      ],
      observaciones: [
        { id: 201, profesor: 'Miss Laura', fecha: '14 Abr', texto: 'Requiere reforzar las tablas de multiplicar básicas.' }
      ]
    }
  ]);

  // 2. Señal para el hijo seleccionado actualmente (por defecto el primero)
  hijoSeleccionado = signal<Hijo>(this.hijos()[0]);

  // 3. Datos para el mini calendario de asistencia
  ultimosDias = signal([
    { label: 'Lun', fecha: '06 Abr', presente: true },
    { label: 'Mar', fecha: '07 Abr', presente: true },
    { label: 'Mie', fecha: '08 Abr', presente: true },
    { label: 'Jue', fecha: '09 Abr', presente: false },
    { label: 'Vie', fecha: '10 Abr', presente: true },
  ]);

  constructor() {}

  // 4. Método para cambiar el hijo en pantalla
  cambiarHijo(hijo: Hijo) {
    this.hijoSeleccionado.set(hijo);
    // Aquí podrías disparar una petición al servidor si los datos no vinieran precargados
  }

  // Método opcional para disparar acciones (ejemplo: botón de pago)
  procesarPago() {
    console.log('Iniciando pasarela de pago para:', this.hijoSeleccionado().nombre);
  }

}
