import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared/shared.module';
import { SignupComponent } from '@auth/components/signup/signup.component';
import { VerificationComponent } from '@auth/components/verification/verification.component';
import { RegisterComponent } from '@auth/containers/register/register.component';
import { AuthContentComponent } from '@auth/components/auth-content/auth-content.component';
import { authRoutes } from '@auth/auth.routes';

@NgModule({
    declarations: [
        AuthContentComponent,
        RegisterComponent,
        SignupComponent,
        VerificationComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forChild(authRoutes),
        SharedModule,
        TranslateModule,
    ],
})
export class AuthModule {}
