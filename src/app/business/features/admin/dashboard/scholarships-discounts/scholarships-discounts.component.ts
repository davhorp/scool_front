import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../../core/services/toast.service';
import { AgreementPrintComponent } from '../agreement-print/agreement-print.component';

interface ScholarshipType {
  id: string;
  nombre: string;
  porcentaje: number;
}

@Component({
  selector: 'app-scholarships-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, AgreementPrintComponent],
  templateUrl: './scholarships-discounts.component.html',
  styleUrls: ['./scholarships-discounts.component.css']
})
export class ScholarshipsDiscountsComponent {

  constructor(private route: ActivatedRoute) {}

  private toastService = inject(ToastService);

  mappedAgreementData = computed(() => ({
  id: Date.now(), // Folio temporal
  tutor: this.selectedStudent().tutor || 'Tutor no especificado',
  alumno: this.selectedStudent().nombre,
  deudaOriginal: this.selectedStudent().deudaActual,
  becaNombre: this.tiposBecas().find(b => b.id === this.selectedBecaId())?.nombre || 'Descuento General',
  descuento: this.descuentoAplicado(),
  montoFinal: this.totalConDescuento()
}));

  // Catálogo de incentivos disponibles
  tiposBecas = signal<ScholarshipType[]>([
    { id: 'PP', nombre: 'Pronto Pago (Temporal)', porcentaje: 15 },
    { id: 'AC', nombre: 'Excelencia Académica', porcentaje: 25 },
    { id: 'HE', nombre: 'Hermanos / Familiar', porcentaje: 10 },
    { id: 'CONV', nombre: 'Convenio de Recuperación', porcentaje: 50 }
  ]);

  // Estado del formulario de aplicación
  selectedStudent = signal({ nombre: 'Luis Mora', deudaActual: 12500, tutor: 'Pedro Mora' });
  selectedBecaId = signal('');
  
  // Cálculo reactivo del descuento
  descuentoAplicado = computed(() => {
    const beca = this.tiposBecas().find(b => b.id === this.selectedBecaId());
    return beca ? (this.selectedStudent().deudaActual * beca.porcentaje) / 100 : 0;
  });

  totalConDescuento = computed(() => 
    this.selectedStudent().deudaActual - this.descuentoAplicado()
  );

  aplicarIncentivo() {
    //if (!this.selectedBecaId()) return;

    // Simulación de actualización en DB
    this.toastService.show(
      'Incentivo Aplicado', 
      `Se ha generado un nuevo recibo para ${this.selectedStudent().nombre} por $${this.totalConDescuento()}`, 
      'success'
    );
    /*
    // 1. Guardar en Spring Boot
    this.saveToBackend().subscribe(() => {
        // 2. Notificar éxito
        this.toastService.show('Éxito', 'Convenio registrado.', 'success');
        
        // 3. Disparar impresión
        setTimeout(() => window.print(), 500);
    });*/
  }

  ngOnInit() {
  const studentId = this.route.snapshot.queryParamMap.get('studentId');
  if (studentId) {
    console.log('Cargando datos del alumno moroso ID:', studentId);
    // Aquí llamarías a tu servicio para cargar los datos de Luis Mora, por ejemplo.
  }
}



}