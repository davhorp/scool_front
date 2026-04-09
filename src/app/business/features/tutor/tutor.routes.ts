import { Routes } from '@angular/router';

export const FATHER_ROUTES: Routes = [
  {
    path: '',
    // Opcional: Un componente 'Layout' que contenga el Sidebar y Navbar de Admin
    loadComponent: () => import('./tutor-layout/tutor-layout.component').then(m => m.TutorLayoutComponent),
    children: [
      {
        path: 'dashboard',
            title: 'Panel de Control - Admin',
            loadComponent: () => import('./tutor-dashboard/tutor-dashboard.component').then(m => m.TutorDashboardComponent)
      },
    {
        path: 'hijos',
        title: 'Gestión de Estudiantes',
        loadComponent: () => import('./hijo-detalle/hijo-detalle.component').then(m => m.HijoDetalleComponent)
      },
     {
        path: 'pagos-familia',/*Corregir el path */
      title: 'Control de Notas',
        loadComponent: () => import('./estado-cuenta/estado-cuenta.component').then(m => m.EstadoCuentaComponent)
      },
      {
        path: 'reporte-conductual',
        title: 'Bitácora de Convivencia',
        loadComponent: () => import('./behavior-report/behavior-report.component').then(m => m.BehaviorReportComponent)
      },
    /*{
        path: 'pagos',
        title: 'Reportes de Pagos',
        loadComponent: () => import('./student-payments/student-payments.component').then(m => m.StudentPaymentsComponent)
      },*/
    /* {
        path: 'configuracion',
        title: 'Configuración del Ciclo Escolar',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },*/
      { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' }
    ]
  }
];