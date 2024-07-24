import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LoginForm, LoginResponse, RefreshTokenResponse } from '@api/models';
import { AuthApi } from '@api/services';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { useMutation } from '@core/services/query/use-mutation';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public readonly authApi = inject(AuthApi);
    public readonly router = inject(Router);
    public readonly toastr = inject(ToastrService);

    public readonly tokenName = 'GIZ-TOKEN';
    public readonly refreshTokenName = 'GIZ-REFRESH';

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
            accessToken: localStorage.getItem(this.tokenName) ?? '',
            refreshToken: localStorage.getItem(this.refreshTokenName) ?? '',
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
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGOUT]);
                });
        }
    }

    /* eslint-disable no-console */
    public removeAccount() {
        return useMutation<string, void>({
            mutationFn: (_todo: string) => new Promise(() => {
                console.log('todo remove account');
            }),
            onSuccess: () => this.logout(),
        });
    }

    public changePassword() {
        return useMutation<string, void>({
            mutationFn: (_todo: string) => new Promise(() => {
                console.log('todo change password');
            }),
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }

    public enable2FA() {
        return useMutation<string, void>({
            mutationFn: (_todo: string) => new Promise(() => {
                console.log('todo enable 2fa');
            }),
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }

    public disable2FA() {
        return useMutation<string, void>({
            mutationFn: (_todo: string) => new Promise(() => {
                console.log('todo disable 2fa');
            }),
            onSuccess: async () => await this.userService.refreshUser(),
        });
    }
    /* eslint-enable no-console */
}
