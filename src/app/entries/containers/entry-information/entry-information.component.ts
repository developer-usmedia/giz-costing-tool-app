import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Entry } from '@api/models';
import { ENTRY_ROUTE, MODULE_ROUTE } from '@core/models';
import { EntriesService } from '@core/services/entries.service';
import { ICON } from '@shared/components/icon/icon.enum';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'giz-entry-information',
    templateUrl: './entry-information.component.html',
    styleUrl: './entry-information.component.scss',
})
export class EntryInformationComponent implements OnDestroy {
    public backTitle = $localize`:entry back-to-overview:Back to overview`;
    public title = $localize`:entry information title:Information`;
    public id$: Observable<string>;
    public entry: CreateQueryResult<Entry, Error> | null = null;

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly entriesService: EntriesService,
    ) {
        this.id$ = this.activatedRoute.params.pipe(
            map((params: Params) => String(params['id'])),
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
}
