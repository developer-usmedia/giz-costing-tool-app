import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';

import { LoginForm } from '@api/models';
import { AuthApi } from '@api/services';
import { AUTH_ROUTE, ROOT_ROUTE } from '@core/models';
import { STATUS } from '@shared/helpers';
import { RouteService } from '@shared/services/route.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SaveUserDetails } from '@store/app.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'giz-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    public submitting = false;
    public wrongPassword = false;
    protected readonly authRoute = AUTH_ROUTE;
    private readonly queryClient = injectQueryClient();

    constructor(
        private readonly authApi: AuthApi,
        private readonly routeService: RouteService,
        private readonly router: Router,
        private readonly store: Store,
        private readonly toastr: ToastrService,
    ) {}

    get title(): string {
        return $localize`:login title:Welcome Back!`;
    }

    get description(): string {
        return $localize`:login description:Please login to continue`;
    }

    public login(loginForm: LoginForm): void {
        this.authApi
            .login(loginForm)
            .then(async () => {
                await this.queryClient.invalidateQueries({ queryKey: ['session'] });
                await this.router.navigate([this.routeService.getLink(ROOT_ROUTE.DASHBOARD)]);
            })
            .catch(async (error: HttpErrorResponse) => {
                const errorBody = error.error as ({ error: string; message: string; statusCode: number });
                if (error.status === STATUS.BAD_REQUEST && errorBody?.message.includes('emailVerificationCode')) {
                    this.store.dispatch(new SaveUserDetails({
                        email: loginForm.email,
                        password: loginForm.password,
                    }));
                    await this.router.navigate([this.routeService.getLink(AUTH_ROUTE.EMAIL_VERIFICATION)]);
                }
                else if (error.status === STATUS.NOT_FOUND || error.status === STATUS.UNAUTHORIZED) {
                    this.wrongPassword = true;
                } else {
                    this.toastr.error($localize`:login error:Something went wrong logging in`);
                }

                this.submitting = false;
            });
    }
}
