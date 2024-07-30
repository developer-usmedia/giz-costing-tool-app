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
    otpCode?: string;
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
    email: string;
    password: string;
    newPassword: string;
    otpCode?: string;
}

export interface RemoveAccountForm {
    email: string;
    password: string;
    otpCode?: string;
}

export interface Disable2FAForm {
    password: string;
    otpCode: string;
}

export interface Verify2FAForm {
    password: string;
    otpCode: string;
}

export type LogoutResponse = SuccessResponse;
export type ForgotPasswordResponse = SuccessResponse;
export type ResetPasswordResponse = SuccessResponse;
export type ChangePasswordResponse = SuccessResponse;
export type VerifyResetCodeResponse = SuccessResponse;
export type VerifyEmailReponse = SuccessResponse;
export type RemoveAccountResponse = SuccessResponse;
export type Disable2FAResponse = SuccessResponse;
export type Verify2FAResponse = SuccessResponse;

export type Enable2FAResponse = {
    qrcode: string;
};

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export type LoginResponse = TokenResponse;
export type RefreshTokenResponse = TokenResponse;


