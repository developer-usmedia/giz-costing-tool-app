export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
}

export interface UserResponse {
    user: User;
}
