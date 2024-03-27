import { Injectable } from '@angular/core';
import { AUTH_ROUTES, MODULE_ROUTE, ROOT_ROUTES, RouteName } from '@core/models';

@Injectable({
    providedIn: 'root',
})
export class RouteService {
    public getLink(routeName: RouteName): string {
        let url = '';

        if (ROOT_ROUTES.includes(routeName)) {
            url += `/${ routeName }`;
        } else if (AUTH_ROUTES.includes(routeName)) {
            url += `/${ MODULE_ROUTE.AUTH }/${ routeName }`;
        } else {
            url += '/';
        }

        return url;
    }
}
