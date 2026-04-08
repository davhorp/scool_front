import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';

interface PaymentRecord {
  id: number;
  alumno: string;
  tutor: string; // <-- Nuevo
  monto: number;
  estado: 'pagado' | 'atrasado';
  fechaVencimiento: string;
  metodoPago: 'Transferencia' | 'Efectivo' | 'Tarjeta'; // <-- Nuevo
}

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance-dashboard.component.html',
  styleUrl: './finance-dashboard.component.css'
})
export class FinanceDashboardComponent implements OnInit{

  private toastService = inject(ToastService);

  isJumpModalOpen = signal(false);
jumpPageInput = signal<number | null>(null);

  // --- NUEVOS SIGNALS PARA UX ---
  isLoading = signal(true); // Controla los skeletons
  selectedIds = signal<Set<number>>(new Set()); // Co

  isProcessing = signal(false);

  // Signals para el modal de edición
isReminderModalOpen = signal(false);
selectedPaymentForMsg = signal<PaymentRecord | null>(null);
editableMessage = signal<string>('');

  // Configuración de paginación
  currentPage = signal(1);
  itemsPerPage = signal(5); // Tu "N" elementos

  // Opciones disponibles para el usuario
pageSizeOptions = [1, 5, 10, 20, 50];

  // 1. Primero filtramos todos los que están atrasados
  filteredAtrasados = computed(() => 
    this.allPayments().filter(p => p.estado === 'atrasado')
  );

  // 2. Calculamos cuántas páginas hay en total
  totalPages = computed(() => 
    Math.ceil(this.filteredAtrasados().length / this.itemsPerPage())
  );

  // 3. Obtenemos solo los elementos de la página actual
  paginatedPayments = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.filteredAtrasados().slice(startIndex, endIndex);
  });

  // Datos maestros (Vendrían de Spring Boot: GET /api/pagos)
  allPayments = signal<PaymentRecord[]>([
    { id: 1, alumno: 'Juan Pérez', tutor: 'Roberto Pérez', monto: 1500, estado: 'atrasado', fechaVencimiento: '2026-04-01', metodoPago: 'Transferencia' },
    { id: 2, alumno: 'Sofía León', tutor: 'Miguel León', monto: 1500, estado: 'atrasado', fechaVencimiento: '2026-03-28', metodoPago: 'Efectivo' },
    { id: 2, alumno: 'Sonia', tutor: 'Alfred León', monto: 1500, estado: 'atrasado', fechaVencimiento: '2026-03-28', metodoPago: 'Tarjeta' },
  // ... más datos
]);

  // --- CÁLCULOS REACTIVOS (Signals) ---
  
  totalRecaudado = computed(() => 
    this.allPayments().filter(p => p.estado === 'pagado').reduce((acc, p) => acc + p.monto, 0)
  );

  totalPendiente = computed(() => 
    this.allPayments().filter(p => p.estado !== 'pagado').reduce((acc, p) => acc + p.monto, 0)
  );

  // Indicador de Riesgo (Morosidad %)
  indiceMorosidad = computed(() => {
    const total = this.allPayments().length;
    const atrasados = this.allPayments().filter(p => p.estado === 'atrasado').length;
    return total > 0 ? (atrasados / total) * 100 : 0;
  });

  ngOnInit() {
    // Simulamos la carga inicial de datos desde la API
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);
  }

  enviarRecordatorio(pago: PaymentRecord) {
    // 1. Guardamos el objeto completo en el Signal para que el modal lo lea
  this.selectedPaymentForMsg.set(pago);
  
  // 2. Generamos la plantilla automática según el contexto
  let infoExtra = '';
  if (pago.metodoPago === 'Transferencia') {
    infoExtra = ' Recuerde que puede realizar su transferencia a la cuenta CLABE: 0123 4567 8901 (Banco Edu).';
  } else if (pago.metodoPago === 'Efectivo') {
    infoExtra = ' Le esperamos en el área de caja de lunes a viernes de 8:00 AM a 2:00 PM.';
  }

  const mensaje = `Hola ${pago.tutor}, le saludamos de la Administración de EduControl. Le recordamos que el pago de la colegiatura de ${pago.alumno} por un monto de $${pago.monto} venció el día ${pago.fechaVencimiento}.${infoExtra} ¡Gracias por su atención!`;
  
  // 3. Cargamos el mensaje en el Signal editable y abrimos el modal
  this.editableMessage.set(mensaje);
  this.isReminderModalOpen.set(true);
    // Aquí llamarías al backend para disparar el correo
  }

  // Métodos de navegación
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onPageSizeChange(newSize: string | number) {
  // Convertimos a número por si el evento llega como string
  const size = Number(newSize);
  this.itemsPerPage.set(size);
  // Regresamos a la página 1 para evitar errores de índice
  this.currentPage.set(1);
}

// Función para abrir el modal y generar el mensaje automático
prepararRecordatorio(pago: PaymentRecord) {
  this.selectedPaymentForMsg.set(pago); // Guardamos el objeto completo
  this.isReminderModalOpen.set(true);
  // Plantilla inteligente según el método de pago
  let infoExtra = '';
  if (pago.metodoPago === 'Transferencia') {
    infoExtra = ' Recuerde que puede realizar su transferencia a la cuenta CLABE: 0123 4567 8901 (Banco Edu).';
  } else if (pago.metodoPago === 'Efectivo') {
    infoExtra = ' Le esperamos en el área de caja de lunes a viernes de 8:00 AM a 2:00 PM.';
  }

  const mensaje = `Hola ${pago.tutor}, le saludamos de la Administración de EduControl. Le recordamos que el pago de la colegiatura de ${pago.alumno} por un monto de $${pago.monto} venció el día ${pago.fechaVencimiento}.${infoExtra} ¡Gracias por su atención!`;
  
  this.editableMessage.set(mensaje);
  this.isReminderModalOpen.set(true);
}

cerrarModal() {
  this.isReminderModalOpen.set(false);
  this.selectedPaymentForMsg.set(null);
}

async confirmarEnvioFinal() {
  if (this.isProcessing()) return; // Evita clics dobles

  this.isProcessing.set(true); // Iniciamos animación

  const dataEnvio = {
    tutor: this.selectedPaymentForMsg()?.tutor,
    mensaje: this.editableMessage()
  };

  // Simulamos una llamada al backend (ej. Spring Boot) de 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Envío exitoso:', dataEnvio);
  
  this.toastService.show('¡Enviado!', 'El recordatorio se envió correctamente.', 'success');
  
  this.isProcessing.set(false); // Detenemos animación
  this.cerrarModal();
}


// --- LÓGICA DE SELECCIÓN ---
  toggleSelection(id: number) {
    this.selectedIds.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  clearSelection() {
    this.selectedIds.set(new Set());
  }

  // Notificación masiva
  notificarSeleccionados() {
    const cantidad = this.selectedIds().size;
    // Aquí podrías abrir un modal especial o reutilizar el actual
    // para enviar un mensaje genérico a los 'n' tutores.
    this.toastService.show(
      'Procesando Lote', 
      `Preparando recordatorios para ${cantidad} alumnos.`, 
      'info'
    );
  }

  saltarAPagina() {
  const total = this.totalPages();
  const msg = `Introduce el número de página (1 - ${total}):`;
  const input = window.prompt(msg, this.currentPage().toString());
  
  if (input !== null) {
    const num = parseInt(input);
    if (!isNaN(num) && num >= 1 && num <= total) {
      this.goToPage(num);
    } else {
      this.toastService.show('Error', 'Página no válida', 'error');
    }
  }
}

abrirJumpModal() {
  this.jumpPageInput.set(this.currentPage());
  this.isJumpModalOpen.set(true);
}

confirmarSalto() {
  const target = this.jumpPageInput();
  const total = this.totalPages();

  if (target !== null && target >= 1 && target <= total) {
    this.goToPage(target);
    this.cerrarJumpModal();
  } else {
    this.toastService.show('Error', `Ingresa un número entre 1 y ${total}`, 'error');
  }
}

cerrarJumpModal() {
  this.isJumpModalOpen.set(false);
}

}
