import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { AuthService } from '@core/services';

@Injectable({
    providedIn: 'root',
})
class PermissionsService {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
    ) {
    }

    async canActivate(): Promise<boolean> {
        // TODO: add check for session here?
        // solves the case where cookie is present but no longer valid
        // Or when cookie is missing somehow
        if (this.authService.isLoggedIn()) {
            return true;
        }

        return await this.router.navigate([ MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGIN ]);
    }
}

export const AuthGuard: CanActivateFn = async (): Promise<boolean> => {
    return await inject(PermissionsService).canActivate();
};
