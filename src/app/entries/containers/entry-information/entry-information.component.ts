import { Component, OnDestroy } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { ENTRY_ROUTE, MODULE_ROUTE } from '@core/models';
import { BehaviorSubject, distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'giz-entry-information',
    templateUrl: './entry-information.component.html',
    styleUrl: './entry-information.component.scss',
})
export class EntryInformationComponent implements OnDestroy{
    public backTitle = $localize`:entry back-to-overview:Back to overview`;
    public title = $localize`:entry information title:Information`;
    public id$: Observable<string>;
    public loading$ = new BehaviorSubject<boolean>(false);

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly entryRoute = ENTRY_ROUTE;

    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
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
                // TODO: Load right entry + get loading from angular query
                this.loading$.next(false);
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        // TODO: Clear query for entry ?
    }
}
