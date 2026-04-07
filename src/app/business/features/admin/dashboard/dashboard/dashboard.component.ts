import { Component, OnInit, inject, signal, AfterViewInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
Chart.register(...registerables);

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend: number; // Porcentaje de cambio
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent 
//implements AfterViewInit 
{

  // Guardamos la instancia para destruirla al cerrar el modal
  studentTrendChartInstance: any;

  // Signal para el expediente del alumno
selectedStudentExpedient = signal<any | null>(null);

// Instancia de la gráfica de tendencia
  private trendChart?: Chart;

  // Signal para el grado seleccionado en la gráfica
  selectedGrade = signal<string | null>(null);

  // Datos de ejemplo de alumnos (esto vendría de tu servicio)
  allStudents = signal([
    { id: 'AL-001', nombre: 'Ana García', grado: '1ro', grupo: 'A', promedio: 9.2 },
    { id: 'AL-045', nombre: 'Luis Pérez', grado: '2do', grupo: 'B', promedio: 8.5 },
    { id: 'AL-088', nombre: 'Carla Soto', grado: '1ro', grupo: 'B', promedio: 7.8 },
    // ... más datos
  ]);

  // Computed Signal para filtrar automáticamente cuando cambie el grado
  filteredStudents = computed(() => {
    const grade = this.selectedGrade();
    return grade 
      ? this.allStudents().filter(s => s.grado === grade)
      : [];
  });

  // Estado del año seleccionado
  selectedYear = signal('2026-2027');
  
  // Variables para guardar las instancias de las gráficas
  gradeChartInstance: any;
  paymentChartInstance: any;
  protected readonly Math = Math;

  percentPaid = signal(75);

  ngAfterViewInit() {
    //this.initGradeChart();
    //this.initPaymentChart();
    this.loadDataByYear(this.selectedYear());
  }

  private toastService = inject(ToastService);
   // Signal para controlar el modal
  isModalOpen = signal(false);

  // Datos temporales del formulario
  newStudent = { nombre: '', grado: '1' };

  // Signals para datos reactivos
  stats = signal<StatCard[]>([
    { label: 'Estudiantes', value: 1250, icon: '🎓', trend: 12, color: '#3498db' },
    { label: 'Docentes', value: 48, icon: '👨‍🏫', trend: 2, color: '#9b59b6' },
    { label: 'Pagos Pendientes', value: '$3,420', icon: '⚠️', trend: -5, color: '#e67e22' },
    { label: 'Asistencia Hoy', value: '94%', icon: '📅', trend: 0.5, color: '#2ecc71' }
  ]);

  recentActivities = signal([
    { user: 'Admin', action: 'Inscribió a nuevo alumno', time: 'Hace 5 min', type: 'info' },
    { user: 'Sec. Académica', action: 'Subió reporte de notas', time: 'Hace 20 min', type: 'success' },
    { user: 'Soporte', action: 'Actualización de sistema', time: 'Hace 1 hora', type: 'warning' }
  ]);

  // Se activa al cambiar el select
  onYearChange(newYear: string) {
    this.selectedYear.set(newYear);
    this.loadDataByYear(newYear);
  }

  loadDataByYear(year: string) {
    console.log(`Cargando datos del ciclo: ${year}`);
    
    // 1. Aquí llamarías a tu servicio de base de datos
    // const data = this.statsService.getData(year);
    
    // 2. Simulación de datos dinámicos según el año
    const mockGradeData = year === '2026-2027' ? [120, 150, 140, 180, 130, 110] : [90, 110, 100, 140, 120, 95];
    const mockPaymentData = year === '2026-2027' ? [85, 15] : [100, 0];

    this.updateGradeChart(mockGradeData);
    this.updatePaymentChart(mockPaymentData);
  }


  updateGradeChart(newData: number[]) {
    if (this.gradeChartInstance) this.gradeChartInstance.destroy();

    this.gradeChartInstance = new Chart('gradeChart', {
      type: 'bar',
      data: {
        labels: ['1ro', '2do', '3ro', '4to', '5to', '6to'],
        datasets: [{
          label: 'Alumnos',
          data: newData,
          backgroundColor: '#3b82f6',
          hoverBackgroundColor: '#1d4ed8', // Cambio de color al pasar el mouse
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const label = this.gradeChartInstance.data.labels[index] as string;
            
            // Seteamos el grado seleccionado
            this.selectedGrade.set(label);
          } else {
            // Si hacen clic fuera de una barra, limpiamos la selección
            this.selectedGrade.set(null);
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              footer: () => 'Haz clic para ver la lista'
            }
          }
        }
      }
    });
  }
  updatePaymentChart(newData: number[]) {
    if (this.paymentChartInstance) {
      this.paymentChartInstance.destroy();
    }

    this.paymentChartInstance = new Chart('paymentChart', {
      type: 'doughnut',
      data: {
        labels: ['Pagado', 'Pendiente'],
        datasets: [{
          data: newData,
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: { 
        cutout: '70%', 
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false 
      }
    });
  }
  ngOnInit() {
    this.toastService.show('Dashboard Listo', 'Datos actualizados del ciclo escolar 2026', 'info');
  }

  refreshData() {
    this.toastService.show('Sincronizando', 'Obteniendo datos del servidor...', 'info', 2000);
    // Lógica para recargar datos...
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  getBarColor(promedio: number): string {
    if (promedio < 6) {
      return '#ef4444'; // Rojo (Peligro/Reprobado)
    } else if (promedio >= 6 && promedio < 8) {
      return '#f59e0b'; // Ámbar/Naranja (Regular)
    } else {
      return '#22c55e'; // Verde (Excelente/Aprobado)
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.newStudent = { nombre: '', grado: '1' }; // Limpiar
  }

  saveStudent() {
    if (!this.newStudent.nombre) {
      this.toastService.show('Error', 'El nombre es obligatorio', 'error');
      return;
    }

    // Simulación de guardado
    this.toastService.show(
      'Alumno Registrado', 
      `${this.newStudent.nombre} ha sido inscrito en ${this.newStudent.grado}° Año`, 
      'success'
    );
    
    this.closeModal();
  }

  initGradeChart() {
    new Chart('gradeChart', {
      type: 'bar',
      data: {
        labels: ['1ro', '2do', '3ro', '4to', '5to', '6to'],
        datasets: [{
          label: 'Alumnos',
          data: [120, 150, 140, 180, 130, 110],
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  initPaymentChart() {
    new Chart('paymentChart', {
      type: 'doughnut',
      data: {
        labels: ['Pagado', 'Pendiente'],
        datasets: [{
          data: [this.percentPaid(), 100 - this.percentPaid()],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: { 
        cutout: '70%', 
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false 
      }
    });
  }

  openExpedient(student: any) {
    const mockDetails = {
      ...student,
      stats: {
        asistencia: 92,
        tendencia: 0.4, // Subió 0.4 respecto al mes pasado
        tareasEntregadas: 45,
        tareasTotales: 50
      },
      academicData: [
        { 
          nombre: 'Matemáticas Avanzadas', 
          promedio: 9.5, 
          tareas: { completadas: 12, totales: 12 },
          examenes: [10, 9, 9.5],
          faltas: 1
        },
        { 
          nombre: 'Lengua y Literatura', 
          promedio: 7.2, 
          tareas: { completadas: 8, totales: 10 },
          examenes: [7, 6.5, 8],
          faltas: 2
        },
        { 
          nombre: 'Historia Universal', 
          promedio: 5.8, 
          tareas: { completadas: 5, totales: 10 },
          examenes: [6, 5, 6.5],
          faltas: 5
        },
        { 
          nombre: 'Física Química', 
          promedio: 8.9, 
          tareas: { completadas: 10, totales: 10 },
          examenes: [9, 8, 9.7],
          faltas: 0
        }
      ]
    };

    this.selectedStudentExpedient.set(mockDetails);

    // Inicializamos la gráfica de tendencia (Sparkline)
    setTimeout(() => this.initTrendChart(), 100);
  }

closeExpedient() {
    if (this.trendChart) this.trendChart.destroy();
    this.selectedStudentExpedient.set(null);
  }

  initStudentTrendChart(labels: string[], data: number[]) {
    // Determinamos el color según si subió o bajó el último mes
    const isUp = data[data.length - 1] >= data[data.length - 2];
    const chartColor = isUp ? '#10b981' : '#ef4444'; // Verde o Rojo

    // Buscamos el canvas específico dentro del modal
    const ctx = document.getElementById('studentTrendChart') as HTMLCanvasElement;
    
    if (!ctx) return;

    this.studentTrendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: chartColor,
          backgroundColor: isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          pointRadius: 0, // Ocultamos los puntos para un look más limpio
          fill: true, // Rellenamos el área inferior
          tension: 0.4 // Curvamos la línea (suavizado)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // Ocultamos leyenda
          tooltip: { enabled: false } // Ocultamos tooltips para que sea puramente visual
        },
        scales: {
          // Ocultamos ambos ejes para el look 'sparkline'
          x: { display: false },
          y: { display: false, min: 0, max: 10 } // Mantenemos el rango 0-10 para contexto
        }
      }
    });
  }

  private initTrendChart() {
    const ctx = document.getElementById('studentTrendChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          data: [8.0, 8.2, 8.1, 8.5, 9.0], // Simulación de subida
          borderColor: '#3b82f6',
          borderWidth: 2,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false, min: 0, max: 10 } }
      }
    });
  }

  async downloadPDF(student: any) {
    // 1. Buscamos el elemento del modal que queremos convertir a PDF
    // Es importante añadir una id o clase específica al modal-body: .print-section
    const data = document.querySelector('.expedient-modal') as HTMLElement;
    
    if (!data) return;

    // 2. Convertimos el HTML a una imagen (Canvas)
    const canvas = await html2canvas(data, {
      scale: 2, // Mayor calidad
      useCORS: true
    });

    // 3. Creamos el documento PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 4. Añadimos la imagen y descargamos
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Expediente_${student.nombre.replace(' ', '_')}.pdf`);
  }

}
