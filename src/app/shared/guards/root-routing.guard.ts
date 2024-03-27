import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const navigateToBrowserLang = (): boolean => {
    const router: Router = inject(Router);
    const prefLang = navigator.language?.substring(0, 2) || 'en';

    if (prefLang === 'es') {
        router.navigateByUrl('/es');
    } else {
        router.navigateByUrl('/en');
    }

    return true;
};

// TODO: This can be replaced by the function itself in angular v18.
// https://github.com/angular/angular/blob/main/CHANGELOG.md#router
// When upgrading to angular v18 please delete guard and use the function itself
export const RootRoutingGuard: CanActivateFn = (): boolean => navigateToBrowserLang();

