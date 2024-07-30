import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AppStore } from '@store/app.store';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';

import { ErrorResponse, LoginForm } from '@api/models';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE, UserDetails } from '@core/models';
import { AuthService } from '@core/services';
import { STATUS } from '@shared/helpers';
import { SaveUserDetails } from '@store/app.actions';
import { Observable, take } from 'rxjs';

@Component({
    selector: 'giz-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    @Select(AppStore.userDetails) userDetails$!: Observable<UserDetails>;

    public submitting = false;
    public wrongPassword = false;
    public wrongOTP = false;
    public step: 'form' | '2FA' = 'form';

    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly authApi = inject(AuthService);
    private readonly router = inject(Router);
    private readonly store = inject(Store);
    private readonly toastr = inject(ToastrService);
    private readonly queryClient = injectQueryClient();

    public getTitle(): string {
        switch (this.step) {
            case '2FA':
                return $localize`:login-2fa title:Verification code`;
            default:
                return $localize`:login title:Welcome Back!`;
        }
    }

    public getDescription(): string {
        switch (this.step) {
            case '2FA':
                return $localize`:login-2fa description:Enter the code from your authenticator app`;
            default:
                return $localize`:login description:Please login to continue`;
        }
    }

    public backToForm(): void {
        this.step = 'form';
    }

    public submit2FA(otpCode: string): void {
        this.submitting = true;

        this.userDetails$
            .pipe(take(1))
            .subscribe((userDetails) => {
                const loginForm: LoginForm = {
                    email: userDetails.email,
                    password: userDetails.password,
                    otpCode: otpCode,
                };
                this.login(loginForm);
            });
    }

    public login(loginForm: LoginForm): void {
        this.submitting = true;

        this.authApi
            .login(loginForm)
            .then(() => this.queryClient.invalidateQueries({ queryKey: ['session'] }))
            .then(() => this.router.navigate([ROOT_ROUTE.DASHBOARD]))
            .catch(async (error: HttpErrorResponse) => {
                const errorBody = error.error as ErrorResponse;
                if (error.status === STATUS.BAD_REQUEST && errorBody?.message.includes('emailVerificationCode')) {
                    this.store.dispatch(new SaveUserDetails({
                        email: loginForm.email,
                        password: loginForm.password,
                    }));
                    await this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.EMAIL_VERIFICATION]);
                }
                else if (error.status === STATUS.BAD_REQUEST && errorBody?.message.includes('Two-factor is enabled')) {
                    this.store.dispatch(new SaveUserDetails({
                        email: loginForm.email,
                        password: loginForm.password,
                    }));
                    this.step = '2FA';
                }
                else if (error.status === STATUS.BAD_REQUEST && errorBody?.message.includes('Two-factor code is invalid')) {
                    this.wrongOTP = true;
                }
                else if (error.status === STATUS.NOT_FOUND || error.status === STATUS.UNAUTHORIZED) {
                    this.step = 'form';
                    this.wrongPassword = true;
                }
                else {
                    this.toastr.error($localize`:login error:Something went wrong logging in`);
                }

                this.submitting = false;
            });
    }
}
