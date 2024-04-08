export enum MODULE_ROUTE {
    AUTH = 'auth',
}

export enum ROOT_ROUTE {
    DASHBOARD = 'dashboard',
    DATA_PROTECTION = 'data-protection',
    EXAMPLES = 'examples',
    IMPRINT = 'imprint',
    TERMS = 'terms',
}
export const ROOT_ROUTES: string[] = Object.values(ROOT_ROUTE);

export enum AUTH_ROUTE {
    LOGIN = 'login',
    REGISTER = 'register',
}
export const AUTH_ROUTES: string[] = Object.values(AUTH_ROUTE);

export type RouteName = MODULE_ROUTE | ROOT_ROUTE | AUTH_ROUTE;
