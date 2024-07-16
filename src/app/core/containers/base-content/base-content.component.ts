import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthApi } from '@api/services';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { filter, Subject, takeUntil } from 'rxjs';

import { User } from '@api/models';
import { BreadcrumbItem, ROOT_ROUTE } from '@core/models';
import { AuthService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { getBreadCrumbTitle } from '@shared/helpers';

@Component({
    selector: 'giz-base-content',
    templateUrl: './base-content.component.html',
    styleUrls: ['./base-content.component.scss'],
})
export class BaseContentComponent implements OnDestroy {
    public readonly router = inject(Router);
    public readonly authApi = inject(AuthApi);
    public readonly authService = inject(AuthService);

    public readonly userSession = injectQuery<User, HttpErrorResponse>(() => ({
        enabled: this.authService.isLoggedIn(),
        queryKey: ['session' ],
        queryFn: () => this.authApi.session(),
        retry: false,
        staleTime: Infinity,
    }));

    public loggedIn = this.authService.isLoggedIn();
    public isHomepage = false;
    public breadcrumb: BreadcrumbItem[] = this.loggedIn ? [
        {
            name: getBreadCrumbTitle(ROOT_ROUTE.DASHBOARD),
            link: ROOT_ROUTE.DASHBOARD,
            icon: ICON.DASHBOARD,
            active: true,
        },
    ] : [
        {
            name: getBreadCrumbTitle(ROOT_ROUTE.HOME),
            link: ROOT_ROUTE.HOME,
            icon: ICON.HOME,
            active: true,
        },
    ];

    private readonly destroyed$ = new Subject<void>();

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
    ) {
        this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                if (this.router.url === '/') {
                    this.isHomepage = true;
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
