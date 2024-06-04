import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppStore } from '@store/app.store';
import { Observable, take } from 'rxjs';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE, UserDetails } from '@core/models';
import { AuthApi } from '@api/services';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { STATUS } from '@shared/helpers';
import { Router } from '@angular/router';

@Component({
    selector: 'giz-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrl: './email-verification.component.scss',
})
export class EmailVerificationComponent {
    @Select(AppStore.userDetails) userDetails$!: Observable<UserDetails>;

    public emailAddress = '';
    public submitting = false;
    public codeInvalid = false;

    constructor(
        private readonly authService: AuthApi,
        private readonly toastr: ToastrService,
        private readonly router: Router,
    ) {
        this.userDetails$
            .pipe(take(1),)
            .subscribe((userDetails) => {
                if (userDetails.email) {
                    this.emailAddress = userDetails.email;
                } else {
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGIN]);
                }
            });
    }

    get title(): string {
        return $localize`:register verification title:Verification Code`;
    }

    get description(): string {
        return $localize`:register verification description:We've sent an email to [${ this.emailAddress }](mailto:${ this.emailAddress }) with a verification code, please enter it below to continue.`;
    }

    public verify(code: string): void {
        this.codeInvalid = false;
        this.submitting = true;

        this.userDetails$
            .pipe(take(1))
            .subscribe((userDetails) => {
                this.authService
                    .login({
                        email: userDetails.email,
                        password: userDetails.password,
                        emailVerificationCode: code,
                    })
                    .then(() => {
                        this.router.navigate([ROOT_ROUTE.DASHBOARD]);
                    })
                    .catch((error: HttpErrorResponse) => {
                        if (error.status === STATUS.BAD_REQUEST) {
                            this.codeInvalid = true;
                        }
                        this.submitting = false;
                    });
            });
    }

    public sendNewCode(): void {
        this.userDetails$
            .pipe(take(1))
            .subscribe((userDetails) => {
                if (!userDetails.email) {
                    this.toastr.error($localize`:verificationCode send error:Something went wrong sending the code`);
                    return;
                }

                this.authService
                    .verifyEmail({ email: userDetails.email })
                    .pipe(take(1))
                    .subscribe({
                        error: (error: HttpErrorResponse) => {
                            if (error.status === STATUS.TOO_MANY_REQUESTS) {
                                this.toastr.error($localize`:verificationCode send error-limit:Too many requests, try again later`);
                            } else {
                                this.toastr.error($localize`:verificationCode send error:Something went wrong sending the code`);
                            }
                            console.error(error);
                        },
                    });
            });
    }
}
