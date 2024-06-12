import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Observable, Subject, take, takeUntil } from 'rxjs';

import { Entry } from '@api/models';
import { ENTRY_ROUTE, MODULE_ROUTE, Scenario } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import {
    ResetScenarioDialogComponent,
    ResetScenarioResult,
} from '../../components/reset-scenario-dialog/reset-scenario-dialog.component';

@Component({
    selector: 'giz-entry-scenarios',
    templateUrl: './entry-scenarios.component.html',
    styleUrl: './entry-scenarios.component.scss',
})
export class EntryScenariosComponent implements OnDestroy {
    public backTitle = $localize`:entry information title:Information`;
    public title = $localize`:entry scenarios title:Scenarios`;
    public id$?: Observable<string>;
    public entry: CreateQueryResult<Entry, Error> | null = null;
    public scenarios: Scenario[] = [
        {
            id: 'close-gap',
            title: $localize`:scenario close-gap title: Close the living wage gap`,
            description: $localize`:scenario close-gap description:Closing the living wage gap by increasing wage levels of all workers below living wage to living wage`,
            imageUrl: 'assets/images/scenario-placeholder.png',
        },
        {
            id: 'absolute-wage',
            title: $localize`:scenario absolute-increase title: Absolute wage increase`,
            description: $localize`:scenario absolute-increase description:Closing the living wage gap by an absolute wage increase for all workers.`,
            imageUrl: 'assets/images/scenario-placeholder.png',
        },
    ];
    public activeScenario?: Scenario;
    public selectedScenario?: Scenario;

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly entryRoute = ENTRY_ROUTE;

    private readonly dialog = inject(Dialog);
    private dialogResetRef?: DialogRef<ResetScenarioResult, ResetScenarioDialogComponent>;
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly entriesService = inject(EntriesService);
    private readonly destroyed$ = new Subject<void>();

    constructor(
    ) {
        this.id$ = this.activatedRoute.parent?.params.pipe(
            map((params: Params) => {
                return String(params['id']);
            }),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        );

        if (this.id$) {
            this.id$.subscribe((id) => {
                if (id) {
                    this.entry = this.entriesService.getEntry(id);
                }
            });
        }
    }

    public selectScenario(scenario: Scenario): void {
        this.selectedScenario = scenario;
    }

    public saveScenario(): void {
        if (this.selectedScenario) {
            this.activeScenario = this.selectedScenario;
            // TODO: Save to entry
        }
    }

    public reset(): void {
        this.dialogResetRef = this.dialog.open(ResetScenarioDialogComponent);
        this.dialogResetRef.closed
            .pipe(take(1))
            .subscribe((result) => {
                if (result?.reset) {
                    this.activeScenario = undefined;
                    this.selectedScenario = undefined;
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
