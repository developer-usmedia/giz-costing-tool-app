import { Route } from '@angular/router';
import { RegisterComponent } from '@auth/containers/register/register.component';

export const authRoutes: Route[] = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
];
