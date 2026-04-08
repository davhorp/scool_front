import { Component, signal, computed, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
Chart.register(...registerables);

// Interfaces para mejorar el autocompletado y seguridad
interface StudentPayment {
  id: number;
  nombre: string;
  tutor: string;
  pagos: Record<string, boolean>; // Llave: nombre del mes, Valor: pagado o no
  monto: number;
}

@Component({
  selector: 'app-payment-dash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-dash.component.html',
  styleUrl: './payment-dash.component.css'
})
export class PaymentDashComponent implements AfterViewInit, OnDestroy {

  protected readonly Math = Math;

  // 1. Capturamos el canvas desde el HTML de forma segura
  @ViewChild('paymentCanvas') paymentCanvas!: ElementRef<HTMLCanvasElement>;

  private paymentChart?: Chart;
  
  // 1. Estados con Signals
  selectedMonth = signal<string>('Abril');
  months = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  
  selectedStudentForReminder = signal<StudentPayment | null>(null);
  reminderMessage = signal<string>('');

  // 1. Estado de selección
selectedIds = signal<Set<number>>(new Set());
isSendingBulk = signal(false);
bulkProgress = signal(0);

  // 2. Simulación de Base de Datos
  studentsRegistry = signal<StudentPayment[]>([
    { id: 1, nombre: 'Juan Pérez', tutor: 'Roberto Pérez', pagos: { Enero: true, Febrero: true, Marzo: true, Abril: false }, monto: 1500 },
    { id: 2, nombre: 'María Jara', tutor: 'Lucía Jara', pagos: { Enero: true, Febrero: true, Marzo: true, Abril: true }, monto: 1500 },
    { id: 3, nombre: 'Carlos Ruiz', tutor: 'Ana Ruiz', pagos: { Enero: true, Febrero: false, Marzo: false, Abril: false }, monto: 1500 },
    { id: 4, nombre: 'Sofía León', tutor: 'Miguel León', pagos: { Enero: true, Febrero: true, Marzo: true, Abril: true }, monto: 1500 },
  ]);

  // 3. Reporte Reactivo (Computed)
  paymentReport = computed(() => {
    const month = this.selectedMonth();
    const all = this.studentsRegistry();
    
    const paid = all.filter(s => s.pagos[month]);
    const pending = all.filter(s => !s.pagos[month]);

    return {
      paid,
      pending,
      percent: all.length > 0 ? Math.round((paid.length / all.length) * 100) : 0
    };
  });

  // Signal para controlar la visibilidad del modal de confirmación masiva
isBulkConfirmModalOpen = signal(false);

// 1. Función que abre el modal de confirmación
openBulkModal() {
  if (this.selectedIds().size > 0) {
    this.isBulkConfirmModalOpen.set(true);
  } else {
    // Opcional: una notificación simple si intentan clickear sin seleccionar nada
    alert('Por favor, selecciona al menos un alumno de la lista.');
  }
}

// 2. Función que cancela y cierra el modal
closeBulkModal() {
  this.isBulkConfirmModalOpen.set(false); // o false
  this.isBulkConfirmModalOpen.set(false);
}

// 3. Función que confirma e inicia el proceso que escribimos antes
confirmBulkSend() {
  this.isBulkConfirmModalOpen.set(false);
  this.processBulkSend(); // Esta es la función de envío que ya tienes
}

  ngAfterViewInit() {
  // Esperamos a que el navegador termine de pintar el CSS
  setTimeout(() => {
    this.updateChart();
  }, 100); 
}

// 2. Alternar selección individual
toggleSelection(id: number) {
  const newSet = new Set(this.selectedIds());
  if (newSet.has(id)) newSet.delete(id);
  else newSet.add(id);
  this.selectedIds.set(newSet);
}

// 3. Seleccionar/Deseleccionar todos los pendientes
toggleAll(event: any) {
  if (event.target.checked) {
    const allIds = this.paymentReport().pending.map(s => s.id);
    this.selectedIds.set(new Set(allIds));
  } else {
    this.selectedIds.set(new Set());
  }
}


// 4. Proceso de envío masivo simulación
async processBulkSend() {
  this.isSendingBulk.set(true);
  this.bulkProgress.set(0);
  
  const idsArray = Array.from(this.selectedIds());
  const total = idsArray.length;

  for (let i = 0; i < total; i++) {
    // Aquí llamarías a tu servicio de Spring Boot
    // await this.paymentService.sendWhatsApp(idsArray[i]);
    
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulación delay
    this.bulkProgress.set(Math.round(((i + 1) / total) * 100));
  }

  alert('¡Envío masivo completado con éxito!');
  this.isSendingBulk.set(false);
  this.selectedIds.set(new Set());
}

clearSelection() {
  // Usamos el método .set() del Signal para pasarle un Set vacío
  this.selectedIds.set(new Set<number>());
}

  ngOnDestroy() {
    // Limpieza de memoria
    if (this.paymentChart) {
      this.paymentChart.destroy();
    }
  }

  // 4. Acciones del Dashboard
  onMonthChange(newMonth: string) {
    this.selectedMonth.set(newMonth);
    this.updateChart();
  }

  openReminderModal(student: StudentPayment) {
    this.selectedStudentForReminder.set(student);
    const mensaje = `Estimado(a) ${student.tutor}, le recordamos que el pago de la mensualidad de ${student.nombre} correspondiente a ${this.selectedMonth()} aún se encuentra pendiente. Atentamente, Administración EduControl.`;
    this.reminderMessage.set(mensaje);
  }

  sendReminder() {
    const student = this.selectedStudentForReminder();
    if (!student) return;

    const data = {
      tutor: student.tutor,
      mensaje: this.reminderMessage()
    };
    
    console.log('Iniciando flujo de envío...', data);
    
    // Simulación de envío exitoso
    alert(`Recordatorio enviado a ${data.tutor}`);
    this.selectedStudentForReminder.set(null);
  }

  // 5. Lógica de la Gráfica
  updateChart() {
    // 2. Verificamos que la referencia exista
    if (!this.paymentCanvas) return;

    const ctx = this.paymentCanvas.nativeElement;

    if (this.paymentChart) {
      this.paymentChart.destroy();
    }

    const report = this.paymentReport();

    this.paymentChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pagado', 'Pendiente'],
        datasets: [{
          data: [report.paid.length, report.pending.length],
          backgroundColor: ['#10b981', '#f1f5f9'],
          hoverBackgroundColor: ['#059669', '#e2e8f0'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 200,
        cutout: '80%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}