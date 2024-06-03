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

export interface LoginResponse {
    success: boolean;
}

export interface LogoutResponse {
    success: boolean;
}

export interface ForgotPasswordResponse {
    success: boolean;
}

export interface ResetPasswordResponse {
    success: boolean;
}

export interface VerifyEmailReponse {
    success: boolean;
}

