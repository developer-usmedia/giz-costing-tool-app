import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { ENTRY_ROUTE, MODULE_ROUTE, RouteName } from '@core/models';
import { ActivatedRoute, Params } from '@angular/router';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-entry-detail',
    templateUrl: './entry-detail.component.html',
    styleUrl: './entry-detail.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class EntryDetailComponent implements OnDestroy {
    public id$: Observable<string>;
    public readonly routes = ENTRY_ROUTE;

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;
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
                // TODO: Load right entry
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        // TODO: Clear query for entry ?
    }

    public download() {
        // TODO: download original excel (?)
    }

    public tabDisabled(_routeName: RouteName): boolean {
        // TODO: Get this from entry
        return true;
    }
}
