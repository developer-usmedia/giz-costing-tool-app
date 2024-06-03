import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_ROUTE } from '@core/models';
import { RouteService } from '@shared/services';

const COOKIE_NAME = 'GIZ-COOKIE';

@Injectable({
    providedIn: 'root',
})
class PermissionsService {
    constructor(
        private readonly router: Router,
        private readonly routeService: RouteService
    ) {
    }

    async canActivate(): Promise<boolean> {
        // TODO: add check for session here?
        // solves the case where cookie is present but no longer valid
        // Or when cookie is missing somehow
        if(document.cookie.includes(COOKIE_NAME)) {
            return true;
        }

        return await this.router.navigate([ this.routeService.getLink(AUTH_ROUTE.LOGIN) ]);
    }
}

export const AuthGuard: CanActivateFn = async (): Promise<boolean> => {
    return await inject(PermissionsService).canActivate();
};
