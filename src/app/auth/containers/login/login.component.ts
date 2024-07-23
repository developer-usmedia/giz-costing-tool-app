import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';

import { LoginForm } from '@api/models';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { AuthService } from '@core/services';
import { STATUS } from '@shared/helpers';
import { SaveUserDetails } from '@store/app.actions';

@Component({
    selector: 'giz-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    public submitting = false;
    public wrongPassword = false;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly authApi = inject(AuthService);
    private readonly router = inject(Router);
    private readonly store = inject(Store);
    private readonly toastr = inject(ToastrService);
    private readonly queryClient = injectQueryClient();

    get title(): string {
        return $localize`:login title:Welcome Back!`;
    }

    get description(): string {
        return $localize`:login description:Please login to continue`;
    }

    public login(loginForm: LoginForm): void {
        this.submitting = true;

        this.authApi
            .login(loginForm)
            .then(() => this.queryClient.invalidateQueries({ queryKey: ['session'] }))
            .then(() => this.router.navigate([ROOT_ROUTE.DASHBOARD]))
            .catch(async (error: HttpErrorResponse) => {
                const errorBody = error.error as ({ error: string; message: string; statusCode: number });
                if (error.status === STATUS.BAD_REQUEST && errorBody?.message.includes('emailVerificationCode')) {
                    this.store.dispatch(new SaveUserDetails({
                        email: loginForm.email,
                        password: loginForm.password,
                    }));
                    await this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.EMAIL_VERIFICATION]);
                } else if (error.status === STATUS.NOT_FOUND || error.status === STATUS.UNAUTHORIZED) {
                    this.wrongPassword = true;
                } else {
                    this.toastr.error($localize`:login error:Something went wrong logging in`);
                }

                this.submitting = false;
            });
    }
}
