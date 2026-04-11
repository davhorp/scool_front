import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    // Opcional: Un componente 'Layout' que contenga el Sidebar y Navbar de Admin
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        title: 'Panel de Control - Admin',
        loadComponent: () => import('./dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'usuarios',
        title: 'Gestión de Usuarios',
        loadComponent: () => import('./dashboard/users-list/users-list.component').then(m => m.UsersListComponent)
      },
      {
        path: 'inscripciones',
        title: 'Control de Inscripciones',
        loadComponent: () => import('./dashboard/enrollment/enrollment.component').then(m => m.EnrollmentComponent)
      },
      {
        path: 'reportes-financieros',
        title: 'Reportes de Pagos',
        loadComponent: () => import('./dashboard/finance-dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent)
      },
      {
        path: 'auditoria',
        title: 'Caja Negra - Auditoría Financiera',
        loadComponent: () => import('./dashboard/audit-history/audit-history.component')
          .then(m => m.AuditHistoryComponent),
        // IMPORTANTE: Aquí iría un Guard para que un admin común no pueda verse a sí mismo
        // canActivate: [ownerGuard] 
      },
      {
        path: 'academicos',
        title: 'Rendimiento Escolar - EduCore',
        loadComponent: () => import('./dashboard/academic-reports/academic-reports.component')
          .then(m => m.AcademicReportsComponent)
      },
      {
        path: 'becas',
        title: 'Gestión de Incentivos',
        loadComponent: () => import('./dashboard/scholarships-discounts/scholarships-discounts.component')
          .then(m => m.ScholarshipsDiscountsComponent)
      },
      {
        path: 'reportes',
        children: [
          {
            path: 'morosidad',
            title: 'Reporte de Cartera Vencida',
            loadComponent: () => import('./dashboard/delinquency-report/delinquency-report.component').then(m => m.DelinquencyReportComponent)
          }
        ]
      },
      {
        path: 'horarios',
        title: 'Gestión de Horarios - EduCore',
        loadComponent: () => import('./dashboard/schedule-assignment/schedule-assignment.component')
          .then(m => m.ScheduleAssignmentComponent)
      },
    /*  {
        path: 'configuracion',
        title: 'Configuración del Ciclo Escolar',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },*/
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];