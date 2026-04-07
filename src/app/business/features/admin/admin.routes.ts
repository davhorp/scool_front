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
      /*{
        path: 'reportes-financieros',
        title: 'Reportes de Pagos',
        loadComponent: () => import('./pages/reports/finance-reports.component').then(m => m.FinanceReportsComponent)
      },
      {
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