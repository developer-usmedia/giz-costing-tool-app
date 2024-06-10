import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

import {
    ForgotPasswordForm,
    ForgotPasswordResponse,
    LoginForm,
    LoginResponse,
    LogoutResponse,
    RefreshTokenResponse,
    RegisterForm,
    ResetPasswordForm,
    ResetPasswordResponse,
    User,
    UserResponse,
    VerifyEmailForm,
    VerifyEmailReponse,
} from '@api/models';
import { BaseApi } from '@api/services/base.api';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApi extends BaseApi {
    public readonly baseUrl = `${ environment.apiUrl }/api/auth`;

    public readonly endpoints = {
        register: `${ this.baseUrl }/register`,
        login: `${ this.baseUrl }/login`,
        session: `${ this.baseUrl }/session`,
        logout: `${ this.baseUrl }/logout`,
        refresh: `${ this.baseUrl }/refresh`,
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

    public logout(): Promise<LogoutResponse> {
        return lastValueFrom(this.post<LogoutResponse>(this.endpoints.logout));
    }

    public refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        return lastValueFrom(this.post<RefreshTokenResponse>(this.endpoints.refresh, { refreshToken: refreshToken }));
    }

    public session(): Promise<User> {
        return lastValueFrom(this.get<User>(this.endpoints.session));
    }

    public verifyEmail(verifyForm: VerifyEmailForm): Promise<VerifyEmailReponse> {
        return lastValueFrom(this.post<VerifyEmailReponse>(this.endpoints.verifyEmail, verifyForm));
    }

    public forgotPassword(forgotPasswordForm: ForgotPasswordForm): Promise<ForgotPasswordResponse> {
        return lastValueFrom(this.post<ForgotPasswordResponse>(this.endpoints.forgotPassword, forgotPasswordForm));
    }

    public resetPassword(resetPasswordForm: ResetPasswordForm): Promise<ResetPasswordResponse> {
        return lastValueFrom(this.post<ResetPasswordResponse>(this.endpoints.resetPassword, resetPasswordForm));
    }
}
