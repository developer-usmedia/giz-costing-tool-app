export enum MODULE_ROUTE {
    AUTH = '/auth',
    ENTRIES = '/entries',
}
export enum ROOT_ROUTE {
    ACCOUNT = '/account',
    DASHBOARD = '/dashboard',
    HOME = '/home',
    DATA_PROTECTION = '/data-protection',
    EXAMPLES = '/examples',
    IMPRINT = '/imprint',
    TERMS = '/terms',
}

export enum AUTH_ROUTE {
    LOGIN = 'login',
    LOGOUT = 'logout',
    EMAIL_VERIFICATION = 'emailVerification',
    PASSWORD_RESET = 'password-reset',
    REGISTER = 'register',
}

export enum ENTRY_ROUTE {
    SCENARIO = 'scenario',
    DISTRIBUTION = 'distribution',
    INFORMATION = '',
    BUYER = 'buyer',
    REPORT = 'report',
}

export type RouteName = MODULE_ROUTE | ROOT_ROUTE | AUTH_ROUTE | ENTRY_ROUTE;
export const ALL_ROUTES = { ...ROOT_ROUTE, ...MODULE_ROUTE, ...AUTH_ROUTE, ...ENTRY_ROUTE };

