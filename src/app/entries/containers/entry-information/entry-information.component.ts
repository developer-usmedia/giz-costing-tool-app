import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { Entry } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-entry-information',
    templateUrl: './entry-information.component.html',
    styleUrl: './entry-information.component.scss',
})
export class EntryInformationComponent implements OnDestroy {
    public backTitle = $localize`:entry back-to-overview:Back to overview`;
    public title = $localize`:entry information title:Information`;

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
    protected readonly entryRoute = ENTRY_ROUTE;
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
}
