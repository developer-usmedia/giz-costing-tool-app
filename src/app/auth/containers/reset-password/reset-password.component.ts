import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

import { ForgotPasswordForm, ResetPasswordForm } from '@api/models';
import { AuthApi } from '@api/services';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { Stepper } from '@shared/components/stepper/stepper.model';
import { STATUS } from '@shared/helpers';

enum RESET_PASSWORD_STEPS {
    FORGOT_PASSWORD = 1,
    RESET_CODE = 2,
    NEW_PASSWORD = 3,
    DONE = 4,
}

@Component({
    selector: 'giz-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
    public currentStep$ = new BehaviorSubject<RESET_PASSWORD_STEPS>(RESET_PASSWORD_STEPS.FORGOT_PASSWORD);
    public submitting = false;
    public verificationSubmitting = false;
    public newPasswordSubmitting = false;
    public codeInvalid = false;
    public steps: Stepper[];
    public emailAddress = '';
    public resetCode = '';

    protected readonly icon = ICON;
    protected readonly resetPasswordSteps = RESET_PASSWORD_STEPS;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly authApi = inject(AuthApi);
    private readonly toastr = inject(ToastrService);

    constructor() {
        this.steps = [
            {
                index: RESET_PASSWORD_STEPS.FORGOT_PASSWORD,
                description: $localize`:reset-password email hint:Enter email for reset instructions`,
            },
            {
                index: RESET_PASSWORD_STEPS.RESET_CODE,
                description: $localize`:reset-password code hint:Enter reset code received via email`,
            },
            {
                index: RESET_PASSWORD_STEPS.NEW_PASSWORD,
                description: $localize`:reset-password password hint:Set new password`,
            },
            {
                index: RESET_PASSWORD_STEPS.DONE,
                description: $localize`:reset-password finalize hint:Reset password done`,
            },
        ];
    }

    public reset(forgotPasswordForm: ForgotPasswordForm): void {
        this.authApi
            .forgotPassword(forgotPasswordForm)
            .then(() => {
                this.emailAddress = forgotPasswordForm.email;
                this.currentStep$.next(RESET_PASSWORD_STEPS.RESET_CODE);
            })
            .catch((error: HttpErrorResponse) => {
                if (error.status === STATUS.TOO_MANY_REQUESTS) {
                    this.toastr.error($localize`:resetCode send error-limit:Too many requests, try again later`);
                } else {
                    this.toastr.error($localize`:resetCode send error:Something went wrong sending the code`);
                }
                console.error(error);
            });
    }

    public verify(code: string): void {
        this.codeInvalid = false;
        this.verificationSubmitting = true;
        const resetForm = {
            email: this.emailAddress,
            code: code,
        };

        this.authApi
            .verifyResetCode(resetForm)
            .then((result) => {
                if (result.success) {
                    this.currentStep$.next(RESET_PASSWORD_STEPS.NEW_PASSWORD);
                    this.resetCode = code;
                }
            })
            .catch((error: HttpErrorResponse) => {
                if (error.status === STATUS.BAD_REQUEST) {
                    this.codeInvalid = true;
                }
                this.verificationSubmitting = false;
            });
    }

    public setNewPassword(resetPasswordForm: ResetPasswordForm): void {
        this.authApi
            .resetPassword(resetPasswordForm)
            .then(() => {
                this.currentStep$.next(RESET_PASSWORD_STEPS.DONE);
            })
            .catch((error: HttpErrorResponse) => {
                if (error.status === STATUS.TOO_MANY_REQUESTS) {
                    this.toastr.error($localize`:resetCode send error-limit:Too many requests, try again later`);
                } else {
                    this.toastr.error($localize`:resetCode send error:Something went wrong sending the code`);
                }
                console.error(error);
            });
    }

    public sendNewCode(): void {
        this.authApi
            .forgotPassword({ email: this.emailAddress })
            .then(() => {
                this.currentStep$.next(RESET_PASSWORD_STEPS.RESET_CODE);
            })
            .catch((error: HttpErrorResponse) => {
                if (error.status === STATUS.TOO_MANY_REQUESTS) {
                    this.toastr.error($localize`:resetCode send error-limit:Too many requests, try again later`);
                } else {
                    this.toastr.error($localize`:resetCode send error:Something went wrong sending the code`);
                }
                console.error(error);
            });
    }

    public getTitle(step: RESET_PASSWORD_STEPS): string {
        switch (step) {
            case RESET_PASSWORD_STEPS.FORGOT_PASSWORD:
                return $localize`:forgot-password email title:Forgot password?`;
            case RESET_PASSWORD_STEPS.RESET_CODE:
                return $localize`:forgot-password code title:Reset Code`;
            case RESET_PASSWORD_STEPS.NEW_PASSWORD:
                return $localize`:forgot-password password title:Set new password`;
            case RESET_PASSWORD_STEPS.DONE:
                return $localize`:forgot-password finalize title:All done!`;
        }
    }

    public getDescription(step: RESET_PASSWORD_STEPS): string {
        switch (step) {
            case RESET_PASSWORD_STEPS.FORGOT_PASSWORD:
                return $localize`:forgot-password email description:No worries, we'll send reset instructions`;
            case RESET_PASSWORD_STEPS.RESET_CODE:
                return $localize`:forgot-password code description:We've sent an email to [${this.emailAddress}](mailto:${this.emailAddress}) with a reset code, please enter it below to continue.`;
            case RESET_PASSWORD_STEPS.NEW_PASSWORD:
                return $localize`:forgot-password password description:Must be at least 8 characters.`;
            case RESET_PASSWORD_STEPS.DONE:
                return $localize`:forgot-password finalize description:Your password has been reset. You can log in using your new password.`;
        }
    }
}
