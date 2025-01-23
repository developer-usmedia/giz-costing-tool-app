import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppStore } from '@store/app.store';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';

import { ErrorResponse, LoginForm } from '@api/models';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE, UserDetails } from '@core/models';
import { AuthService } from '@core/services';
import { STATUS } from '@shared/helpers';
import { SaveUserDetails } from '@store/app.actions';
import { Observable, take } from 'rxjs';
import { AuthContentComponent } from '../../components/auth-content/auth-content.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { TwofactorFormComponent } from '../../components/twofactor-form/twofactor-form.component';

@Component({
    selector: 'giz-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        AuthContentComponent,
        LoginFormComponent,
        TwofactorFormComponent,
        RouterLink,
    ],
})
export class LoginComponent {
    userDetails$: Observable<UserDetails> = inject(Store).select(AppStore.userDetails);

    public submitting = false;
    public wrongPassword = false;
    public wrongOTP = false;
    public locked = false;
    public step: 'form' | '2FA' = 'form';

    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly authApi = inject(AuthService);
    private readonly router = inject(Router);
    private readonly store = inject(Store);
    private readonly toastr = inject(ToastrService);
    private readonly queryClient = inject(QueryClient);

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
        this.wrongPassword = false;
        this.wrongOTP = false;
        this.locked = false;

        this.authApi
            .login(loginForm)
            .then(() => this.queryClient.invalidateQueries({ queryKey: ['session'] }))
            .then(() => this.router.navigate([ROOT_ROUTE.DASHBOARD]))
            .catch(async (error: HttpErrorResponse) => {
                const errorBody = error.error as ErrorResponse;
                const errorStatus = error.status as STATUS;

                if (errorStatus === STATUS.BAD_REQUEST && errorBody?.message.toLowerCase().includes('emailVerificationCode')) {
                    this.store.dispatch(new SaveUserDetails({
                        email: loginForm.email,
                        password: loginForm.password,
                    }));
                    await this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.EMAIL_VERIFICATION]);
                }
                else if (errorStatus === STATUS.BAD_REQUEST && errorBody?.message.toLowerCase().includes('two-factor is enabled')) {
                    this.store.dispatch(new SaveUserDetails({
                        email: loginForm.email,
                        password: loginForm.password,
                    }));
                    this.step = '2FA';
                }
                else if (errorStatus === STATUS.BAD_REQUEST && errorBody?.message.toLowerCase().includes('two-factor code is invalid')) {
                    this.wrongOTP = true;
                }
                else if (errorStatus === STATUS.BAD_REQUEST && errorBody?.message.toLowerCase().includes('login locked')) {
                    this.locked = true;
                }
                else if (errorStatus === STATUS.NOT_FOUND || errorStatus === STATUS.UNAUTHORIZED) {
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
