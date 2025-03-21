import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClearUserDetails } from '@store/app.actions';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';

import { AuthApi } from '@api/services';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE, UserDetails } from '@core/models';
import { AuthService } from '@core/services';
import { STATUS } from '@shared/helpers';
import { AppStore } from '@store/app.store';
import { AuthContentComponent } from '../../components/auth-content/auth-content.component';
import { VerificationComponent } from '../../components/verification/verification.component';

@Component({
    selector: 'giz-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrl: './email-verification.component.scss',
    imports: [AuthContentComponent, VerificationComponent],
})
export class EmailVerificationComponent {
    userDetails$: Observable<UserDetails> = inject(Store).select(AppStore.userDetails);

    public emailAddress = '';
    public submitting = false;
    public codeInvalid = false;

    private readonly authApi = inject(AuthApi);
    private readonly authService = inject(AuthService);
    private readonly toastr = inject(ToastrService);
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    constructor() {
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
                        this.store.dispatch(new ClearUserDetails());
                        this.router.navigate([ROOT_ROUTE.DASHBOARD]);
                    })
                    .catch((error: HttpErrorResponse) => {
                        if (error.status as STATUS === STATUS.BAD_REQUEST) {
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

                this.authApi
                    .verifyEmail({ email: userDetails.email })
                    .catch((error: HttpErrorResponse) => {
                            if (error.status as STATUS === STATUS.TOO_MANY_REQUESTS) {
                                this.toastr.error($localize`:verificationCode send error-limit:Too many requests, try again later`);
                            } else {
                                this.toastr.error($localize`:verificationCode send error:Something went wrong sending the code`);
                            }
                            console.error(error);
                        },
                    );
            });
    }
}
