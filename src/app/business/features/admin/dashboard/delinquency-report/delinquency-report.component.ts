import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Debtor {
  id: number;
  alumno: string;
  grado: string;
  tutor: string;
  telefono: string;
  deudaTotal: number;
  ultimoPago: string;
  diasAtraso: number;
}

@Component({
  selector: 'app-delinquency-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delinquency-report.component.html',
  styleUrls: ['./delinquency-report.component.css']
})
export class DelinquencyReportComponent {

  constructor(private router: Router) {}
  
  searchTerm = signal('');
  filtroDias = signal<number>(0); // 0 = Todos, 30, 60, 90

  // Datos simulados (Vendrían de tu API de Spring Boot)
  debtors = signal<Debtor[]>([
    { id: 1, alumno: 'Mateo Pérez', grado: '1° B Sec', tutor: 'Juan Pérez', telefono: '5512345678', deudaTotal: 5000, ultimoPago: '2026-02-05', diasAtraso: 64 },
    { id: 2, alumno: 'Sofía García', grado: '3° A Pri', tutor: 'Elena Rico', telefono: '5587654321', deudaTotal: 2500, ultimoPago: '2026-03-01', diasAtraso: 39 },
    { id: 3, alumno: 'Luis Mora', grado: '2° C Sec', tutor: 'Pedro Mora', telefono: '5544332211', deudaTotal: 12500, ultimoPago: '2025-12-15', diasAtraso: 115 },
    { id: 4, alumno: 'Ana Soto', grado: '6° B Pri', tutor: 'Lucía Baz', telefono: '5566778899', deudaTotal: 2500, ultimoPago: '2026-03-10', diasAtraso: 30 }
  ]);

  // Lógica de filtrado reactivo
  filteredDebtors = computed(() => {
    return this.debtors().filter(d => {
      const matchesSearch = d.alumno.toLowerCase().includes(this.searchTerm().toLowerCase()) || 
                            d.tutor.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesDays = d.diasAtraso >= this.filtroDias();
      return matchesSearch && matchesDays;
    });
  });

  // Resumen rápido
  totalRecuperable = computed(() => 
    this.filteredDebtors().reduce((acc, d) => acc + d.deudaTotal, 0)
  );

  enviarRecordatorioMasivo() {
    console.log('Disparando emails y notificaciones push a:', this.filteredDebtors().length, 'tutores');
    alert('Recordatorios de pago enviados correctamente.');
  }

  irAAplicarBeca(studentId: number) {
  // Navegamos al componente de becas pasando el ID del alumno por parámetro
  this.router.navigate(['/admin/becas'], { queryParams: { studentId } });
}
}