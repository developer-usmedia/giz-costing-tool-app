import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Subject, take, takeUntil } from 'rxjs';

import {
    Entry,
    ScenarioCreateMutation,
    ScenarioUpdateMutation,
    WorkerListResponse,
    WorkersPagingParams,
} from '@api/models';
import { ScenarioSpecsForm } from '@api/models/scenario.model';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, PagingParams, ScenarioInfo, SCENARIOS } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import { getPagingParamsFromQueryParams, getParamsFromPagingParams } from '@shared/helpers';

import {
    ResetScenarioData,
    ResetScenarioDialogComponent,
    ResetScenarioResult,
} from '../reset-scenario-dialog/reset-scenario-dialog.component';
import { EntryHeaderComponent } from '../../components/entry-header/entry-header.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NoResultsComponent } from '@shared/components/no-results/no-results.component';
import { ScenarioComponent } from '../../components/scenario/scenario.component';
import { ScenarioCardComponent } from '../../components/scenario-card/scenario-card.component';
import { EntryFooterComponent } from '../../components/entry-footer/entry-footer.component';


@Component({
    selector: 'giz-entry-scenarios',
    templateUrl: './entry-scenarios.component.html',
    styleUrl: './entry-scenarios.component.scss',
    imports: [
        EntryHeaderComponent,
        ButtonComponent,
        RouterLink,
        SpinnerComponent,
        NoResultsComponent,
        ScenarioComponent,
        ScenarioCardComponent,
        EntryFooterComponent,
    ],
})
export class EntryScenariosComponent implements OnDestroy {
    public backTitle = $localize`:entry information title:Information`;
    public title = $localize`:entry scenarios title:Scenarios`;

    public readonly entriesService = inject(EntriesService);
    public entriesApi = inject(EntriesApi);

    public pagingParams = signal<WorkersPagingParams | undefined>(undefined);
    public entryId = signal<string>('');
    public entry = injectQuery<Entry, HttpErrorResponse>(() => ({
        enabled: this.entryId() != '',
        queryKey: ['entry', { id: this.entryId() }],
        queryFn: () => this.entriesApi.getOne(this.entryId()),
        retry: 1,
        staleTime: Infinity,
    }));
    public workers = injectQuery<WorkerListResponse, HttpErrorResponse>(() => ({
        enabled: this.pagingParams() != undefined,
        queryKey: ['workers', { id: this.entryId(), ...this.pagingParams() }],
        queryFn: () => this.entriesApi.getWorkers(this.entryId(), this.pagingParams()),
        retry: 1,
        staleTime: Infinity,
    }));

    public scenarioCreateMutation = this.entriesService.createScenario();
    public scenarioUpdateMutation = this.entriesService.updateScenario();

    public scenarios: ScenarioInfo[] = SCENARIOS;
    public selectedScenario?: ScenarioInfo;
    public activeScenario?: ScenarioInfo;
    public scenarioState?: 'start' | 'specs' | 'view';

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyed$ = new Subject<void>();
    private readonly dialog = inject(Dialog);
    private readonly toastr = inject(ToastrService);

    constructor(
    ) {
        this.activatedRoute.parent?.params.pipe(
            map((params: Params) => {
                return String(params['id']);
            }),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        ).subscribe((id) => {
            if (id) {
                this.entryId.set(id);
            }
        });

        this.activatedRoute.queryParams.pipe(
            takeUntil(this.destroyed$),
            map((params: Params) => getPagingParamsFromQueryParams<WorkersPagingParams>(params, 'workers')),
            distinctUntilChanged(),
        ).subscribe((params) => {
            this.pagingParams.set(params);
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
                    this.entriesService.refreshEntry(entry.id);
                    this.entriesService.refreshWorkers(entry.id);
                    this.toastr.success($localize`:scenario-update success:Successfully updated scenario`);
                },
                onError: () => {
                    this.toastr.error($localize`:scenario-update error:Something went wrong updating the scenario`);
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
                onError: () => {
                    this.toastr.error($localize`:scenario-update error:Something went wrong updating the scenario`);
                },
            });
        }
    }

    public reset(): void {
        const dialogResetRef = this.dialog.open<ResetScenarioResult, ResetScenarioData, ResetScenarioDialogComponent>(ResetScenarioDialogComponent, {
            data: {
                entry: this.entry.data(),
            },
        });

        dialogResetRef.closed
            .pipe(take(1))
            .subscribe((result) => {
                if (result?.reset) {
                    this.activeScenario = undefined;
                    this.selectedScenario = undefined;
                    this.scenarioState = 'start';
                }
            });
    }

    public onPageEvent(pageEvent: PageEvent): void {
        const currentParams = this.pagingParams();
        const params = {
            ...currentParams,
            index: pageEvent.page,
            size: pageEvent.pageSize,
        };

        this.router.navigate(
            [MODULE_ROUTE.ENTRIES, this.entryId(), ENTRY_ROUTE.SCENARIO],
            { queryParams: getParamsFromPagingParams<PagingParams>(params) }
        );
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private determineState(entry?: Entry) {
        if (!entry?.scenario?.specification) {
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
