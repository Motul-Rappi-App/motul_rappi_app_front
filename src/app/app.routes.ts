import { Routes } from '@angular/router';
import { UserLoginComponent } from './user/auth/user-login/user-login.component';
import { AdminLoginComponent } from './admin/auth/admin-login/admin-login.component';

export const routes: Routes = [
    {
        path: 'sellers',
        children: [
            {
                path: 'login',
                component: UserLoginComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: 'admin',
        children: [
            {
                path: 'login',
                component: AdminLoginComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'sellers',
        pathMatch: 'full'
    },
    { 
        path: '**',
        redirectTo: 'sellers',
    }
];
