import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { LoginForm, LoginResponse, RegisterForm, UserResponse, VerifyEmailForm, VerifyEmailReponse } from '@api/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly baseUrl = `${ environment.apiUrl }/auth`;

    private readonly endpoints = {
        register: `${ this.baseUrl }/register`,
        login: `${ this.baseUrl }/login`,
        logout: `${ this.baseUrl }/logout`,
        forgotPassword: `${ this.baseUrl }/forgot-password`,
        resetPassword: `${ this.baseUrl }/reset-password`,
        verifyEmail: `${ this.baseUrl }/verify-email`,
        twoFactorEnable: `${ this.baseUrl }/2fa/enable`,
        twoFactorVerify: `${ this.baseUrl }/2fa/verify/{code}`,
        twoFactorDisable: `${ this.baseUrl }/2fa/disable`,
    };

    constructor(private readonly http: HttpClient) {
    }

    public register(registerForm: RegisterForm): Observable<UserResponse> {
        return this.http.post<UserResponse>(this.endpoints.register, registerForm);
    }

    public login(loginForm: LoginForm): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.endpoints.login, loginForm);
    }

    public verifyEmail(verifyForm: VerifyEmailForm): Observable<VerifyEmailReponse> {
        return this.http.post<VerifyEmailReponse>(this.endpoints.verifyEmail, verifyForm);
    }
}
