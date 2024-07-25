import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental';
import { filter, Subject, takeUntil } from 'rxjs';

import { Entry, User } from '@api/models';
import { EntriesApi } from '@api/services';
import { BreadcrumbItem, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { UserService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { getBreadCrumbTitle } from '@shared/helpers';

@Component({
    selector: 'giz-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnDestroy {
    public readonly user: CreateQueryResult<User, Error> = this.userService.getUser();
    public breadcrumb: BreadcrumbItem[] = [];

    public entriesApi = inject(EntriesApi);
    public entryId = signal<string | undefined>(undefined);
    public entry = injectQuery<Entry, HttpErrorResponse>(() => ({
        enabled: this.entryId() != undefined,
        queryKey: ['entry', { id: this.entryId() }],
        queryFn: () => this.entriesApi.getOne(this.entryId() as string),
        retry: 1,
        staleTime: Infinity,
    }));

    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
    ) {
        router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                const entryRegex = /entries\/([^/\s]+)(?:\/|$)/;
                const match = this.router.url.match(entryRegex);
                if (match && match[1]) {
                    this.entryId.set(match[1]);
                } else {
                    this.entryId.set(undefined);
                }
                this.getBreadcrumbs();
            });

        toObservable(this.entry.data)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((entry) => {
                if (!entry) {
                    return;
                }
                this.getBreadcrumbs();
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
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

            const entryName = this.entry?.data() ? `${ this.entry.data()?.facility.name ?? '' } (${ this.entry.data()?.payroll?.year ?? '' })` : '';
            this.breadcrumb.push({
                name: entryName,
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
