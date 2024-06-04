import { Component, OnInit } from '@angular/core';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { NavigationEnd, Router } from '@angular/router';

import { BreadcrumbItem, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
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

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
    ) {
        router.events.subscribe((value) => {
            if (value instanceof NavigationEnd) {
                this.getBreadcrumbs();
            }
        });
    }

    public ngOnInit() {
        this.getBreadcrumbs();
    }

    private getBreadcrumbs() {
        // Add dashboard icon breadcrumb
        this.breadcrumb = [
            {
                name: getBreadCrumbTitle(ROOT_ROUTE.DASHBOARD),
                link: ROOT_ROUTE.DASHBOARD,
                icon: ICON.DASHBOARD,
                active: this.router.url.endsWith(ROOT_ROUTE.DASHBOARD),
            },
        ];

        // Add module breadcrumb for detail pages
        if (this.router.url.includes(MODULE_ROUTE.ENTRIES) && !this.router.url.endsWith(MODULE_ROUTE.ENTRIES)) {
            this.breadcrumb.push({
                name: getBreadCrumbTitle(MODULE_ROUTE.ENTRIES),
                link: MODULE_ROUTE.ENTRIES,
            });

            // TODO: Make this work with api
            // const id = this.router.url.split('/').pop();
            // const item = await this.entryService.getOneById(id);
            // const name = `${ item.title } (${ item.year })`;
            this.breadcrumb.push({
                name: 'Facility name (2023)',
                active: true,
            });
        }

        // Entries overview
        if (this.router.url.endsWith(MODULE_ROUTE.ENTRIES)) {
            this.breadcrumb.push({
                name: getBreadCrumbTitle(MODULE_ROUTE.ENTRIES),
                link: MODULE_ROUTE.ENTRIES,
                active: true,
            });
        }
    }
}
