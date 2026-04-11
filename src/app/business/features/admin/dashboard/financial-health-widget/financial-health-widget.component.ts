import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-health-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-health-widget.component.html',
  styleUrls: ['./financial-health-widget.component.css']
})
export class FinancialHealthWidgetComponent {

  constructor(private router: Router) {}
  
  readonly isfFormula = `Indice Salud Financiera (ISF) = (Ingresos Reales - Costo Operativo) / Ingresos Proyectados X 100`;
  // Datos base (Vendrían del servicio financiero)
  ingresosReales = signal(450000);
  costoOperativo = signal(120000);
  ingresosProyectados = signal(500000);

  // Cálculo del ISF usando tu fórmula
  // ISF = ((Reales - Costos) / Proyectados) * 100
  isf = computed(() => {
    const reales = this.ingresosReales();
    const costos = this.costoOperativo();
    const proyectados = this.ingresosProyectados();
    
    if (proyectados === 0) return 0;
    return ((reales - costos) / proyectados) * 100;
  });

  // Estado de alerta reactivo
  isAlertActive = computed(() => this.isf() < 70);

  goToMorosidad() {
  this.router.navigate(['/admin/reportes/morosidad']);
}

}