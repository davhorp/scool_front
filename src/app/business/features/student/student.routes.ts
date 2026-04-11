import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    // Opcional: Un componente 'Layout' que contenga el Sidebar y Navbar de Admin
    loadComponent: () => import('./student-layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      {
        path: 'dashboard',
            title: 'Panel de Control - Admin',
            loadComponent: () => import('./student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
     {
        path: 'horario',
        title: 'Gestión de Estudiantes',
        loadComponent: () => import('./student-schedule/student-schedule.component').then(m => m.StudentScheduleComponent)
      },
      {
        path: 'calificaciones',/*Corregir el path */
       title: 'Control de Notas',
        loadComponent: () => import('./student-ratings/student-ratings.component').then(m => m.StudentRatingsComponent)
      },
    {
        path: 'pagos',
        title: 'Reportes de Pagos',
        loadComponent: () => import('./student-payments/student-payments.component').then(m => m.StudentPaymentsComponent)
      },
      {
        path: 'tarea/:id', // El :id es crucial
        title: 'Entregar Tarea - EduCore',
        loadComponent: () => import('./student-assignment-submission/student-assignment-submission.component')
          .then(m => m.StudentAssignmentSubmissionComponent)
      },
      {
        path: 'materias',
        title: 'Mis Materias',
        loadComponent: () => import('./student-subjects/student-subjects.component').then(m => m.StudentSubjectsComponent)
      },
      {
        path: 'materia/:id', 
        title: 'Aula Virtual - EduCore',
        // Aquí cargas el componente del aula (que programarás después)
        loadComponent: () => import('./student-classroom/student-classroom.component')
          .then(m => m.StudentClassroomComponent)
      },
      {
        path: 'asistencia', 
        title: 'Control de Asistencia',
        // Aquí cargas el componente del aula (que programarás después)
        loadComponent: () => import('./student-attendance/student-attendance.component')
          .then(m => m.StudentAttendanceComponent)
      },
      {
        path: 'configuracion', 
        title: 'Configuración del Perfil',
        // Aquí cargas el componente del aula (que programarás después)
        loadComponent: () => import('./student-config/student-config.component')
          .then(m => m.StudentConfigComponent)
      },
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