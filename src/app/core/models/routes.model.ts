export enum MODULE_ROUTE {
    AUTH = 'auth',
    ENTRIES = 'entries',
    ENTRY = 'entries',
}

export enum ROOT_ROUTE {
    ACCOUNT = 'account',
    DASHBOARD = 'dashboard',
    HOME = 'home',
    DATA_PROTECTION = 'data-protection',
    EXAMPLES = 'examples',
    IMPRINT = 'imprint',
    TERMS = 'terms',
}
export const ROOT_ROUTES: string[] = Object.values(ROOT_ROUTE);

export enum AUTH_ROUTE {
    LOGIN = 'login',
    LOGOUT = 'logout',
    EMAIL_VERIFICATION = 'emailVerification',
    PASSWORD_RESET = 'password-reset',
    REGISTER = 'register',
}
export const AUTH_ROUTES: string[] = Object.values(AUTH_ROUTE);

export enum ENTRY_ROUTE {
    SCENARIO = 'scenario',
    DISTRIBUTION = 'distribution',
    INFORMATION = '',
    BUYER = 'buyer',
    REPORT = 'report',
}
export const ENTRY_ROUTES: string[] = Object.values(ENTRY_ROUTE);

export type RouteName = MODULE_ROUTE | ROOT_ROUTE | AUTH_ROUTE | ENTRY_ROUTE;
