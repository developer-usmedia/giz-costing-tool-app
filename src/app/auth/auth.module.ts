import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from '@auth/containers/login/login.component';
import { RegisterComponent } from '@auth/containers/register/register.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { AUTH_ROUTE } from '@core/models';
import { EmailVerificationComponent } from './containers/email-verification/email-verification.component';
import { LogoutComponent } from './containers/logout/logout.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                redirectTo: AUTH_ROUTE.LOGIN,
                pathMatch: 'full',
            },
            {
                path: AUTH_ROUTE.LOGIN,
                component: LoginComponent,
                canActivate: [AuthGuard],
            },
            {
                path: AUTH_ROUTE.LOGOUT,
                component: LogoutComponent,
            },
            {
                path: AUTH_ROUTE.REGISTER,
                component: RegisterComponent,
                canActivate: [AuthGuard],
            },
            {
                path: AUTH_ROUTE.EMAIL_VERIFICATION,
                component: EmailVerificationComponent,
                canActivate: [AuthGuard],
            },
            {
                path: AUTH_ROUTE.PASSWORD_RESET,
                component: ResetPasswordComponent,
            },
        ]),
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class AuthModule {}
