import { Component, OnInit } from '@angular/core';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { Router } from '@angular/router';

import { BreadcrumbItem, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { RouteService } from '@shared/services';
import { User } from '@api/models';
import { UserService } from '@core/services/user.service';
import { getBreadCrumbTitle } from '@shared/helpers';

@Component({
    selector: 'giz-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
    public readonly userSession: CreateQueryResult<User, Error> = this.userService.getUserSession();
    public breadcrumb: BreadcrumbItem[] = [];
    public user?: User;

    constructor(
        private readonly router: Router,
        private readonly routeService: RouteService,
        private readonly userService: UserService,
    ) {
    }

    public ngOnInit() {
        this.getBreadcrumbs();
        this.user = this.userSession.data();
    }

    private getBreadcrumbs() {
        this.breadcrumb = [
            {
                name: getBreadCrumbTitle(ROOT_ROUTE.DASHBOARD),
                link: this.routeService.getLink(ROOT_ROUTE.DASHBOARD),
                icon: ICON.DASHBOARD,
                active: this.router.url.endsWith(ROOT_ROUTE.DASHBOARD),
            },
        ];

        if (this.router.url.includes(MODULE_ROUTE.ENTRIES) && !this.router.url.endsWith(MODULE_ROUTE.ENTRIES)) {
            this.breadcrumb.push({
                name: getBreadCrumbTitle(MODULE_ROUTE.ENTRIES),
                link: this.routeService.getLink(MODULE_ROUTE.ENTRIES),
            });
        }

        // If not dashboard: add item
        if (!this.router.url.endsWith(ROOT_ROUTE.DASHBOARD)) {
            this.breadcrumb.push({
                name: getBreadCrumbTitle(MODULE_ROUTE.ENTRIES),
                active: true,
            });
        }
    }
}
