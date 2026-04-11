import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuditLog {
  id: number;
  fecha: string;
  adminNombre: string;
  accion: string;
  estudiante: string;
  montoOriginal: number;
  montoFinal: number;
  ip: string;
}

@Component({
  selector: 'app-audit-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent {
  
  filtroAdmin = signal('');
  
  // Datos de auditoría (Simulados de la DB)
  logs = signal<AuditLog[]>([
    { id: 101, fecha: '2026-04-10 09:15', adminNombre: 'Carlos Admin', accion: 'Aplicó Beca Convenio (50%)', estudiante: 'Luis Mora', montoOriginal: 12500, montoFinal: 6250, ip: '192.168.1.45' },
    { id: 102, fecha: '2026-04-10 10:30', adminNombre: 'Ana Secretaría', accion: 'Aplicó Beca Hermanos (10%)', estudiante: 'Mateo Pérez', montoOriginal: 5000, montoFinal: 4500, ip: '192.168.1.12' },
    { id: 103, fecha: '2026-04-09 16:45', adminNombre: 'Carlos Admin', accion: 'Aplicó Beca Pronto Pago (15%)', estudiante: 'Sofía García', montoOriginal: 2500, montoFinal: 2125, ip: '192.168.1.45' }
  ]);

  // Filtrado reactivo para el dueño
  filteredLogs = computed(() => {
    const term = this.filtroAdmin().toLowerCase();
    return this.logs().filter(log => 
      log.adminNombre.toLowerCase().includes(term) || 
      log.estudiante.toLowerCase().includes(term)
    );
  });

  // Cálculo de impacto total de descuentos otorgados
  totalDescontado = computed(() => 
    this.logs().reduce((acc, log) => acc + (log.montoOriginal - log.montoFinal), 0)
  );
}