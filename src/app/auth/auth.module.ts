import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

import { AuthContentComponent } from '@auth/components/auth-content/auth-content.component';
import { LoginFormComponent } from '@auth/components/login-form/login-form.component';
import { SignupComponent } from '@auth/components/signup/signup.component';
import { VerificationComponent } from '@auth/components/verification/verification.component';
import { LoginComponent } from '@auth/containers/login/login.component';
import { RegisterComponent } from '@auth/containers/register/register.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { AUTH_ROUTE } from '@core/models';
import { SharedModule } from '@shared/shared.module';
import { EmailVerificationComponent } from './containers/email-verification/email-verification.component';
import { LogoutComponent } from './containers/logout/logout.component';

@NgModule({
    declarations: [
        AuthContentComponent,
        LoginComponent,
        LoginFormComponent,
        RegisterComponent,
        SignupComponent,
        VerificationComponent,
        LogoutComponent,
        EmailVerificationComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
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
                canActivate: [AuthGuard],
                component: EmailVerificationComponent,
            },
        ]),
        SharedModule,
        AngularQueryDevtools,
    ],
})
export class AuthModule {}
