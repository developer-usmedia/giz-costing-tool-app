import { Component, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@api/services';
import { LoginForm, RegisterForm } from '@api/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { Stepper } from '@shared/components/stepper/stepper.model';
import { STATUS } from '@shared/helpers';

enum REGISTER_STEPS {
    REGISTER = 1,
    VERIFICATION_CODE = 2,
    DONE = 3,
}

@Component({
    selector: 'giz-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
    public currentStep$ = new BehaviorSubject<REGISTER_STEPS>(REGISTER_STEPS.REGISTER);
    public signupSubmitting = false;
    public verificationSubmitting = false;
    public emailTaken = false;
    public codeInvalid = false;
    public steps: Stepper[];

    protected readonly icon = ICON;
    protected readonly registerSteps = REGISTER_STEPS;

    protected loginDetails: LoginForm = {
        email: '',
        password: '',
    };

    protected userId?: string ;

    constructor(
        private readonly authService: AuthService,
        private readonly toastr: ToastrService,
        private readonly translateService: TranslateService,
    ) {
        this.steps = [
            {
                index: REGISTER_STEPS.REGISTER,
                description: this.translateService.instant('register.signup.tooltip') as string,
            },
            {
                index: REGISTER_STEPS.VERIFICATION_CODE,
                description: this.translateService.instant('register.verification.tooltip') as string,
            },
            {
                index: REGISTER_STEPS.DONE,
                description: this.translateService.instant('register.finalize.tooltip') as string,
            },
        ];
    }

    public signup(registerForm: RegisterForm): void {
        this.emailTaken = false;
        this.signupSubmitting = true;
        this.authService.register(registerForm).pipe(take(1)).subscribe({
            next: (response) => {
                this.loginDetails.email = registerForm.email;
                this.loginDetails.password = registerForm.password;
                this.userId = response.user?.id;
                this.currentStep$.next(REGISTER_STEPS.VERIFICATION_CODE);
            },
            error: (error: HttpErrorResponse) => {
                if (error.status === STATUS.BAD_REQUEST) {
                    this.emailTaken = true;
                }
                this.signupSubmitting = false;
            },
        });
    }

    public verify(code: string): void {
        this.codeInvalid = false;
        this.verificationSubmitting = true;
        this.authService.login({
            email: this.loginDetails.email,
            password: this.loginDetails.password,
            emailVerificationCode: code,
        }).pipe(take(1)).subscribe({
            next: () => {
                this.currentStep$.next(REGISTER_STEPS.DONE);
            },
            error: (error: HttpErrorResponse) => {
                if (error.status === STATUS.BAD_REQUEST) {
                    this.codeInvalid = true;
                }
                this.verificationSubmitting = false;
            },
        });
    }

    public sendNewCode(): void {
        if (!this.userId) {
            this.toastr.error(this.translateService.instant('form.verificationCode.resend.error') as string);
            return;
        }

        this.authService.verifyEmail({
            userId: this.userId,
        }).pipe(take(1)).subscribe({
            error: (error: HttpErrorResponse) => {
                this.toastr.error(this.translateService.instant('form.verificationCode.resend.error') as string);
                console.error(error);
            },
        });
    }

    public getTranslationKey(step: REGISTER_STEPS): string {
        switch (step) {
            case REGISTER_STEPS.REGISTER:
                return 'signup';
            case REGISTER_STEPS.VERIFICATION_CODE:
                return 'verification';
            case REGISTER_STEPS.DONE:
                return 'finalize';
        }
    }
}
