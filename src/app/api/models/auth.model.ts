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

export interface SuccessReponse {
    success: boolean;
}

export type LogoutResponse = SuccessReponse;
export type ForgotPasswordResponse = SuccessReponse;
export type ResetPasswordResponse = SuccessReponse;
export type VerifyResetCodeResponse = SuccessReponse;
export type VerifyEmailReponse = SuccessReponse;

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export type LoginResponse = TokenResponse;
export type RefreshTokenResponse = TokenResponse;


