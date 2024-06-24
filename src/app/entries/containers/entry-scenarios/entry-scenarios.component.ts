import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Observable, Subject, take, takeUntil } from 'rxjs';

import { Entry, ScenarioCreateMutation, ScenarioUpdateMutation } from '@api/models';
import { ScenarioSpecsForm } from '@api/models/scenario.model';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, ScenarioInfo, SCENARIOS } from '@core/models';
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
    public readonly entriesService = inject(EntriesService);
    public entriesApi = inject(EntriesApi);
    public entryId = signal<string>('');
    public entry = injectQuery<Entry, HttpErrorResponse>(() => ({
        enabled: this.entryId() != '',
        queryKey: ['entry', { id: this.entryId() }],
        queryFn: () => this.entriesApi.getOne(this.entryId()),
        retry: 1,
        staleTime: Infinity,
    }));

    public scenarioCreateMutation = this.entriesService.createScenario();
    public scenarioUpdateMutation = this.entriesService.updateScenarioSpecs();
    public scenarioDeleteMutation = this.entriesService.deleteScenarioSpecs();

    public scenarios: ScenarioInfo[] = SCENARIOS;
    public selectedScenario?: ScenarioInfo;
    public activeScenario?: ScenarioInfo;
    public scenarioState?: 'start' | 'specs' | 'view';

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyed$ = new Subject<void>();
    private readonly dialog = inject(Dialog);
    private dialogResetRef?: DialogRef<ResetScenarioResult, ResetScenarioDialogComponent>;
    private readonly toastr = inject(ToastrService);

    constructor(
    ) {
        this.id$ = this.activatedRoute.parent?.params.pipe(
            map((params: Params) => {
                return String(params['id']);
            }),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        );

        this.id$?.subscribe((id) => {
            if (id) {
                this.entryId.set(id);
            }
        });

        toObservable(this.entry.data).subscribe((entry) => {
            this.determineState(entry);
        });
    }

    public selectScenario(scenario: ScenarioInfo): void {
        this.selectedScenario = scenario;
    }

    public saveScenario(): void {
        if (this.selectedScenario) {
            this.activeScenario = this.selectedScenario;
            this.scenarioState = 'specs';
        }
    }

    public changeSpecs(): void {
        this.scenarioState = 'specs';
    }

    public saveSpecs(specsForm: ScenarioSpecsForm): void {
        const entry = this.entry?.data();
        if (!entry || !this.activeScenario) {
            return;
        }

        if (entry.scenario) {
            const mutation: ScenarioUpdateMutation = {
                entryId: entry.id,
                scenarioUpdate: {
                    specifications: specsForm,
                },
            };

            this.scenarioUpdateMutation.mutate(mutation, {
                onSuccess: () => {
                    this.scenarioState = 'view';
                    this.toastr.success($localize`:scenario-update success:Successfully updated scenario`);
                },
                onError: (error) => {
                    this.toastr.error($localize`:scenario-update error:Something went wrong updating the scenario`, error.message);
                },
            });
        } else {
            const mutation: ScenarioCreateMutation = {
                entryId: entry.id,
                scenarioCreate: {
                    type: this.activeScenario.type,
                    specifications: specsForm,
                },
            };
            this.scenarioCreateMutation.mutate(mutation, {
                onSuccess: () => {
                    this.toastr.success($localize`:scenario-update success:Successfully updated scenario`);
                    this.scenarioState = 'view';
                },
                onError: (error) => {
                    this.toastr.error($localize`:scenario-update error:Something went wrong updating the scenario`, error.message);
                },
            });
        }
    }

    public reset(): void {
        this.dialogResetRef = this.dialog.open(ResetScenarioDialogComponent);
        this.dialogResetRef.closed
            .pipe(take(1))
            .subscribe((result) => {
                const entry = this.entry?.data();
                if (!result?.reset || !entry) {
                    return;
                }

                if (!entry.scenario) {
                    this.scenarioState = 'start';
                    return;
                }

                this.scenarioDeleteMutation.mutate(entry.id, {
                    onSuccess: () => {
                        this.activeScenario = undefined;
                        this.selectedScenario = undefined;
                        this.scenarioState = 'start';
                    },
                    onError: (error) => {
                        this.toastr.error($localize`:scenario-delete error:Something went wrong while resetting the scenario`, error.message);
                    },
                });
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private determineState(entry?: Entry) {
        if (!entry?.scenario) {
            this.scenarioState = 'start';
            return;
        }

        const activeScenario = this.scenarios.find(scenario => scenario.type === entry?.scenario?.type);
        if (!activeScenario) {
            this.scenarioState = 'start';
            return;
        }

        this.activeScenario = activeScenario;
        this.selectedScenario = activeScenario;
        this.scenarioState = 'view';
    }
}
