import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

import {
    ChangePasswordForm, ChangePasswordResponse,
    ForgotPasswordForm,
    ForgotPasswordResponse,
    LoginForm,
    LoginResponse,
    LogoutResponse,
    RefreshTokenResponse,
    RegisterForm,
    RemoveAccountForm,
    RemoveAccountResponse,
    ResetPasswordForm,
    ResetPasswordResponse,
    User,
    UserResponse,
    VerifyEmailForm,
    VerifyEmailReponse,
    VerifyResetCodeForm,
    VerifyResetCodeResponse,
} from '@api/models';
import { BaseApi } from '@api/services/base.api';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApi extends BaseApi {
    public readonly baseUrl = `${ environment.apiUrl }/api/auth`;

    public readonly endpoints = {
        account: `${ this.baseUrl }/account`,
        register: `${ this.baseUrl }/register`,
        login: `${ this.baseUrl }/login`,
        whoami: `${ this.baseUrl }/whoami`,
        logout: `${ this.baseUrl }/logout`,
        refresh: `${ this.baseUrl }/refresh`,
        forgotPassword: `${ this.baseUrl }/forgot-password`,
        resetPassword: `${ this.baseUrl }/reset-password`,
        changePassword: `${ this.baseUrl }/change-password`,
        verifyCode: `${ this.baseUrl }/verify-code`,
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
        return lastValueFrom(this.get<User>(this.endpoints.whoami));
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

    public changePassword(changePasswordForm: ChangePasswordForm): Promise<ChangePasswordResponse> {
        return lastValueFrom(this.post<ChangePasswordResponse>(this.endpoints.changePassword, changePasswordForm));
    }

    public verifyResetCode(verifyResetCodeForm: VerifyResetCodeForm): Promise<VerifyResetCodeResponse> {
        return lastValueFrom(this.post<VerifyResetCodeResponse>(this.endpoints.verifyCode, verifyResetCodeForm));
    }

    public removeAccount(form: RemoveAccountForm): Promise<RemoveAccountResponse> {
        return lastValueFrom(this.delete<RemoveAccountResponse>(this.endpoints.account, form));
    }
}
