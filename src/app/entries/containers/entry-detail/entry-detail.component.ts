import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { Entry, EntryStatus } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, RouteName } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EntryCardComponent } from '@shared/components/entry-card/entry-card.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { TabComponent } from '@shared/components/tab/tab.component';

@Component({
    selector: 'giz-entry-detail',
    templateUrl: './entry-detail.component.html',
    styleUrl: './entry-detail.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        SpinnerComponent,
        EntryCardComponent,
        TabGroupComponent,
        TabComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
    ],
})
export class EntryDetailComponent implements OnDestroy {
    public readonly routes = ENTRY_ROUTE;

    public entriesApi = inject(EntriesApi);
    public entryId = signal<string>('');
    public entry = injectQuery<Entry, HttpErrorResponse>(() => ({
        enabled: this.entryId() != '',
        queryKey: ['entry', { id: this.entryId() }],
        queryFn: () => this.entriesApi.getOne(this.entryId()),
        retry: 1,
        staleTime: Infinity,
    }));

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyed$ = new Subject<void>();

    constructor() {
        this.activatedRoute.params
            .pipe(
                map((params: Params) => String(params['id'])),
                takeUntil(this.destroyed$),
                distinctUntilChanged(),
            )
            .subscribe((id) => {
                if (id) {
                    this.entryId.set(id);
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public tabDisabled(routeName: RouteName): boolean {
        const entry = this.entry.data();
        if (!entry) {
            return true;
        }

        if (routeName === ENTRY_ROUTE.DISTRIBUTION) {
            return ![
                EntryStatus.SCENARIO_DONE,
                EntryStatus.DISTRIBUTION_DONE,
                EntryStatus.COMPLETED,
            ].includes(entry.status);
        }

        if (routeName === ENTRY_ROUTE.BUYER) {
            return ![
                EntryStatus.DISTRIBUTION_DONE,
                EntryStatus.COMPLETED,
            ].includes(entry.status);
        }

        if (routeName === ENTRY_ROUTE.REPORT) {
            return ![
                EntryStatus.COMPLETED,
            ].includes(entry.status);
        }

        return true;
    }
}
