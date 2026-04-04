import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./business/admin/dashboard/dashboard.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./business/admin/profile/profile.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'tables',
                loadComponent: () => import('./business/admin/tables/tables.component'),
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }

        ]
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
        path: '**',
        redirectTo: 'dashboard'
    }
];
