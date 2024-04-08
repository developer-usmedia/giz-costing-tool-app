import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { SignupComponent } from '@auth/components/signup/signup.component';
import { VerificationComponent } from '@auth/components/verification/verification.component';
import { LoginComponent } from '@auth/containers/login/login.component';
import { RegisterComponent } from '@auth/containers/register/register.component';
import { AuthContentComponent } from '@auth/components/auth-content/auth-content.component';
import { AUTH_ROUTE } from '@core/models';

@NgModule({
    declarations: [
        AuthContentComponent,
        LoginComponent,
        RegisterComponent,
        SignupComponent,
        VerificationComponent,
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
                component: RegisterComponent,
            },
            {
                path: AUTH_ROUTE.REGISTER,
                component: RegisterComponent,
            },
        ]),
        SharedModule,
    ],
})
export class AuthModule {}
