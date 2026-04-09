import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    // Opcional: Un componente 'Layout' que contenga el Sidebar y Navbar de Admin
    loadComponent: () => import('./teacher-layout/teacher-layout.component').then(m => m.TeacherLayoutComponent),
    children: [
      {
        path: 'dashboard',
        title: 'Panel de Control - Admin',
        loadComponent: () => import('./teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
      },
      {
        path: 'students',
        title: 'Gestión de Estudiantes',
        loadComponent: () => import('./teacher-students/teacher-students.component').then(m => m.TeacherStudentsComponent)
      },
      {
        path: 'grades',/*Corregir el path */
        title: 'Control de Notas',
        loadComponent: () => import('./grades-entry/grades-entry.component').then(m => m.GradesEntryComponent)
      },
      {
        path: 'registrar-conducta',
        title: 'Reportar Conducta',
        loadComponent: () => import('./teacher-behavior-form/teacher-behavior-form.component').then(m => m.TeacherBehaviorFormComponent)
      },
      {
        path: 'attendance',
        title: 'Reportes de Pagos',
        loadComponent: () => import('./pase-lista/pase-lista.component').then(m => m.PaseListaComponent)
      },
      {
        path: 'lesson-planner',
        title: 'Planificador de Clases',
        loadComponent: () => import('./lesson-planner/lesson-planner.component').then(m => m.LessonPlannerComponent)
      },
     /*{
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