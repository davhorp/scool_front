import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
   { 
        path: 'admin', 
        canActivate: [AuthGuard],
        //canActivate: [roleGuard(['admin'])],
        loadChildren: () => import('./business/features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { 
        path: 'docente', 
        canActivate: [AuthGuard],
        //canActivate: [roleGuard(['docente'])],
        loadChildren: () => import('./business/features/teacher/teacher.routes').then(m => m.TEACHER_ROUTES)
    },
    { 
        path: 'alumno', 
        canActivate: [AuthGuard],
        //canActivate: [roleGuard(['alumno'])],
        loadChildren: () => import('./business/features/student/student.routes').then(m => m.STUDENT_ROUTES)
    },
    { 
        path: 'padre', 
         canActivate: [AuthGuard],
        //canActivate: [roleGuard(['padre'])],
        loadChildren: () => import('./business/features/tutor/tutor.routes').then(m => m.FATHER_ROUTES)
    },
    {
        path: 'login',
        loadComponent: ()=> import('./business/authentication/login/login.component'),
        //canActivate: [AuthenticatedGuard]
    },
    {
        path: 'verify-account-user',
        loadComponent: ()=> import('./business/verifyAccount/verify-account-user/verify-account-user.component')
    },
    {
        path: 'forget-password',
        loadComponent: ()=> import('./business/authentication/forget-password/forget-password.component')
    },
    {
        path: 'reset-password',
        loadComponent: ()=> import('./business/authentication/reset-password/reset-password.component')
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
