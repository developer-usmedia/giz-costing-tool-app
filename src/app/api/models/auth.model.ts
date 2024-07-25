import { SuccessResponse } from '@api/models/response.model';

export interface RegisterForm {
    email: string;
    password: string;
}

export interface VerifyEmailForm {
    email: string;
}

export interface LoginForm {
    email: string;
    password: string;
    emailVerificationCode?: string;
}

export interface ForgotPasswordForm {
    email: string;
}

export interface ResetPasswordForm {
    email: string;
    newPassword: string;
    resetToken: string;
}

export interface VerifyResetCodeForm {
    email: string;
    code: string;
}

export interface ChangePasswordForm {
    currentPassword: string;
    password: string;
    otpCode?: number;
}

export type LogoutResponse = SuccessResponse;
export type ForgotPasswordResponse = SuccessResponse;
export type ResetPasswordResponse = SuccessResponse;
export type ChangePasswordResponse = SuccessResponse;
export type VerifyResetCodeResponse = SuccessResponse;
export type VerifyEmailReponse = SuccessResponse;

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export type LoginResponse = TokenResponse;
export type RefreshTokenResponse = TokenResponse;


