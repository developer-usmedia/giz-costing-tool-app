import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { from, Observable, throwError } from 'rxjs';

import {
    ChangePasswordForm,
    ChangePasswordResponse,
    Disable2FAForm,
    Disable2FAResponse,
    Verify2FAForm,
    Enable2FAResponse,
    LoginForm,
    LoginResponse,
    RefreshTokenResponse,
    RemoveAccountForm,
    RemoveAccountResponse, Verify2FAResponse,
} from '@api/models';
import { AuthApi } from '@api/services';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { useMutation } from '@core/services/query/use-mutation';
import { UserService } from '@core/services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public readonly authApi = inject(AuthApi);
    public readonly router = inject(Router);
    public readonly toastr = inject(ToastrService);

    public readonly tokenName = 'GIZ-TOKEN';
    public readonly refreshTokenName = 'GIZ-REFRESH';

    private readonly queryClient = inject(QueryClient);
    private readonly userService = inject(UserService);

    public isLoggedIn(): boolean {
        const token = this.getToken();

        if (!token.accessToken || !token.refreshToken) {
            return false;
        }

        return true;
    }

    public refreshToken(): Observable<RefreshTokenResponse> {
        const token = this.getToken();

        if (!token.refreshToken) {
            return throwError(() => 'Error: no refreshToken found.');
        }

        return from(this.authApi.refreshToken(token.refreshToken));
    }

    public async login(loginForm: LoginForm): Promise<LoginResponse> {
        return this.authApi.login(loginForm).then((res) => {
            this.setToken(res.accessToken, res.refreshToken);

            return res;
        });
    }

    public setToken(accessToken: string, refreshToken: string) {
        localStorage.setItem(this.tokenName, accessToken);
        localStorage.setItem(this.refreshTokenName, refreshToken);
    }

    public getToken() {
        return {
            accessToken: localStorage.getItem(this.tokenName),
            refreshToken: localStorage.getItem(this.refreshTokenName),
        };
    }

    public removeToken() {
        localStorage.removeItem(this.tokenName);
        localStorage.removeItem(this.refreshTokenName);
    }

    public logout() {
        if (this.getToken().accessToken) {
            this.authApi
                .logout()
                .catch(() => {
                    this.toastr.error($localize`:logout error:Something went wrong logging out`);
                })
                .finally(() => {
                    this.removeToken();
                    this.queryClient.removeQueries();
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGOUT]);
                });
        }
    }

    public removeAccount() {
        return useMutation<RemoveAccountForm, RemoveAccountResponse>({
            mutationFn: (form: RemoveAccountForm) => {
                return this.authApi.removeAccount(form);
            },
            onSuccess: () => this.removeToken(),
        });
    }

    public changePassword() {
        return useMutation<ChangePasswordForm, ChangePasswordResponse>({
            mutationFn: (form: ChangePasswordForm) => {
                return this.authApi.changePassword(form);
            },
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }

    public enable2FA() {
        return useMutation<unknown, Enable2FAResponse>({
            mutationFn: () => {
                return this.authApi.enable2FA();
            },
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }

    public verify2FA() {
        return useMutation<Verify2FAForm, Verify2FAResponse>({
            mutationFn: (form: Verify2FAForm) => {
                return this.authApi.verify2FA(form);
            },
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }

    public disable2FA() {
        return useMutation<Disable2FAForm, Disable2FAResponse>({
            mutationFn: (form: Disable2FAForm) => {
                return this.authApi.disable2FA(form);
            },
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }
}
