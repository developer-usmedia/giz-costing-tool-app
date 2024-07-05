import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { Entry, EntryStatus } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, RouteName } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-entry-detail',
    templateUrl: './entry-detail.component.html',
    styleUrl: './entry-detail.component.scss',
    encapsulation: ViewEncapsulation.None,
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
       this.activatedRoute.params.pipe(
            map((params: Params) => String(params['id'])),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        ).subscribe((id) => {
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
        // TODO: Get this from entry status
        const entry = this.entry.data();
        if (!entry) {
            return true;
        }

        if (routeName === ENTRY_ROUTE.DISTRIBUTION) {
            return ![EntryStatus.PAYROLL_DONE, EntryStatus.SCENARIO_DONE].includes(entry.status);
        }
        //
        // if (routeName === ENTRY_ROUTE.BUYER) {
        //     return !entry.scenario && !entry.distribution;
        // }
        //
        // if (routeName === ENTRY_ROUTE.REPORT) {
        //     return !entry.scenario && !entry.distribution && !entry.facility.buyerProportion;
        // }

        return true;
    }
}
