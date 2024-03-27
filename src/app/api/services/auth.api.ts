import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

import {
    LoginForm,
    LoginResponse,
    LogoutResponse,
    RegisterForm,
    User,
    UserResponse,
    VerifyEmailForm,
    VerifyEmailReponse,
} from '@api/models';
import { BaseApi } from '@core/services/api/base.api';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApi extends BaseApi {
    private readonly baseUrl = `${ environment.apiUrl }/api/auth`;

    private readonly endpoints = {
        register: `${ this.baseUrl }/register`,
        login: `${ this.baseUrl }/login`,
        session: `${ this.baseUrl }/session`,
        logout: `${ this.baseUrl }/logout`,
        forgotPassword: `${ this.baseUrl }/forgot-password`,
        resetPassword: `${ this.baseUrl }/reset-password`,
        verifyEmail: `${ this.baseUrl }/verify-email`,
        twoFactorEnable: `${ this.baseUrl }/2fa/enable`,
        twoFactorVerify: `${ this.baseUrl }/2fa/verify/{code}`,
        twoFactorDisable: `${ this.baseUrl }/2fa/disable`,
    };

    public register(registerForm: RegisterForm): Observable<UserResponse> {
        return this.post<UserResponse>(this.endpoints.register, registerForm);
    }

    public login(loginForm: LoginForm): Promise<LoginResponse> {
        return lastValueFrom(this.post<LoginResponse>(this.endpoints.login, loginForm));
    }

    public logout(): Observable<LogoutResponse> {
        return this.post<LogoutResponse>(this.endpoints.logout);
    }

    public session(): Promise<User> {
        return lastValueFrom(this.get<User>(this.endpoints.session));
    }

    public verifyEmail(verifyForm: VerifyEmailForm): Observable<VerifyEmailReponse> {
        return this.post<VerifyEmailReponse>(this.endpoints.verifyEmail, verifyForm);
    }
}
