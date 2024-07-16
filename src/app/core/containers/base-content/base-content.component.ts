import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { User } from '@api/models';
import { BreadcrumbItem, ROOT_ROUTE } from '@core/models';
import { UserService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { getBreadCrumbTitle } from '@shared/helpers';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'giz-base-content',
    templateUrl: './base-content.component.html',
    styleUrls: ['./base-content.component.scss'],
})
export class BaseContentComponent implements OnDestroy {
    public readonly router = inject(Router);
    public readonly userService = inject(UserService);

    public readonly userSession: CreateQueryResult<User, Error> = this.userService.getUserSession();
    public breadcrumb: BreadcrumbItem[] = [{
        name: getBreadCrumbTitle(ROOT_ROUTE.DASHBOARD),
        link: ROOT_ROUTE.DASHBOARD,
        icon: ICON.DASHBOARD,
        active: this.router.url.endsWith(ROOT_ROUTE.DASHBOARD),
    }];

    public isHomepage = false;
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
                if (this.router.url.endsWith('homepage')) {
                    this.isHomepage = true;
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
