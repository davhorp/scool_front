import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';

interface Payment {
  id: string;
  concepto: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: 'pagado' | 'pendiente' | 'vencido';
  metodo?: string;
}

@Component({
  selector: 'app-student-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-payments.component.html',
  styleUrl: './student-payments.component.css'
})
export class StudentPaymentsComponent {

  private toastService = inject(ToastService);

  // Información de Beca
  scholarship = signal({ nombre: 'Beca Académica', porcentaje: 20 });

  // Listado de pagos
  payments = signal<Payment[]>([
    { id: 'REC-001', concepto: 'Inscripción Ciclo 2026', monto: 1500, fechaVencimiento: '2026-02-01', fechaPago: '2026-01-28', estado: 'pagado', metodo: 'Tarjeta' },
    { id: 'REC-002', concepto: 'Colegiatura Marzo', monto: 2500, fechaVencimiento: '2026-03-05', fechaPago: '2026-03-03', estado: 'pagado', metodo: 'Transferencia' },
    { id: 'REC-003', concepto: 'Colegiatura Abril', monto: 2500, fechaVencimiento: '2026-04-05', estado: 'vencido' },
    { id: 'REC-004', concepto: 'Seguro Escolar Anual', monto: 800, fechaVencimiento: '2026-04-15', estado: 'pendiente' }
  ]);

  // Cálculos Automáticos
  totalDebt = computed(() => 
    this.payments()
      .filter(p => p.estado !== 'pagado')
      .reduce((acc, p) => acc + p.monto, 0)
  );

  payNow(payment: Payment) {
    this.toastService.show('Pasarela de Pago', `Redirigiendo para pagar: ${payment.concepto}`, 'info');
    // Aquí integrarías Stripe, PayPal o tu pasarela local
  }

  downloadReceipt(payment: Payment) {
    this.toastService.show('Descargando', 'Generando recibo oficial PDF...', 'success');
    // Lógica window.print() o descarga de archivo
  }

}
