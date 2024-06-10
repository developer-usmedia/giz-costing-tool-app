import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { AuthService } from '@core/services';

@Injectable({
    providedIn: 'root',
})
class PermissionsService {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    async canActivate(_activatedRoute: ActivatedRouteSnapshot, routeState: RouterStateSnapshot): Promise<boolean> {
        const loggedIn = this.authService.isLoggedIn();
        const onAuthRoute = routeState.url.includes(MODULE_ROUTE.AUTH);

        if (loggedIn && onAuthRoute) {
            return await this.router.navigate([ROOT_ROUTE.DASHBOARD]);
        }

        if (loggedIn || onAuthRoute) {
            return true;
        }

        await this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGIN]);
        return false;
    }
}

export const AuthGuard: CanActivateFn = async (activatedRoute, routeState): Promise<boolean> => {
    return await inject(PermissionsService).canActivate(activatedRoute, routeState);
};
