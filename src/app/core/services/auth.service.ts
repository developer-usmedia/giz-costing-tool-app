import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { ToastrService } from 'ngx-toastr';
import { Observable, from } from 'rxjs';

import { LoginForm, LoginResponse, RefreshTokenResponse } from '@api/models';
import { AuthApi } from '@api/services';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public readonly authApi = inject(AuthApi);
    public readonly router = inject(Router);
    public readonly toastr = inject(ToastrService);

    public readonly tokenName = 'GIZ-TOKEN';
    public readonly refreshTokenName = 'GIZ-REFRESH';

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
}
