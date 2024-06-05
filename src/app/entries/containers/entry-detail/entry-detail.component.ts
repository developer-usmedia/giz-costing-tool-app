import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { ENTRY_ROUTE, MODULE_ROUTE, RouteName } from '@core/models';
import { ActivatedRoute, Params } from '@angular/router';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { ICON } from '@shared/components/icon/icon.enum';
import { Entry } from '@api/models';
import { EntriesService } from '@core/services';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';

@Component({
    selector: 'giz-entry-detail',
    templateUrl: './entry-detail.component.html',
    styleUrl: './entry-detail.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class EntryDetailComponent implements OnDestroy {
    public id$: Observable<string>;
    public readonly routes = ENTRY_ROUTE;
    public entry: CreateQueryResult<Entry, Error> | null = null;

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly entriesService: EntriesService,
    ) {
        this.id$ = this.activatedRoute.params.pipe(
            map((params: Params) => {
                return String(params['id']);
            }),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        );

        this.id$.subscribe((id) => {
            if (id) {
                this.entry = this.entriesService.getEntry(id);
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public tabDisabled(_routeName: RouteName): boolean {
        // TODO: Get this from entry status
        return true;
    }
}
