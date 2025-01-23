import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { determineWageIncrease, getWorkerDistribution } from '@api/helpers/worker.helper';
import {
    Distribution,
    DistributionForm,
    Entry,
    ScenarioUpdateMutation,
    Worker,
    WorkerListResponse,
    WorkersPagingParams,
} from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, PagingParams, ROOT_ROUTE } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import { getPagingParamsFromQueryParams, getParamsFromPagingParams } from '@shared/helpers';
import {
    ResetWorkersData,
    ResetWorkersDialogComponent,
    ResetWorkersResult,
} from '../reset-workers-dialog/reset-workers-dialog.component';
import { WorkerDistributionDialogComponent } from '../worker-distribution-dialog/worker-distribution-dialog.component';
import { EntryHeaderComponent } from '../../components/entry-header/entry-header.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { DistributionFormComponent } from '../../components/distribution-form/distribution-form.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableRowComponent } from '@shared/components/table-row/table-row.component';
import { TableCellComponent } from '@shared/components/table-cell/table-cell.component';
import { NoResultsComponent } from '@shared/components/no-results/no-results.component';
import { TooltipAdvancedDirective } from '@shared/directives/tooltip-advanced.directive';
import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { EntryFooterComponent } from '../../components/entry-footer/entry-footer.component';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { EmptyPipe, GenderPipe } from '@shared/pipes';

@Component({
    selector: 'giz-entry-distribution',
    templateUrl: './entry-distribution.component.html',
    styleUrl: './entry-distribution.component.scss',
    imports: [
        EntryHeaderComponent,
        ButtonComponent,
        RouterLink,
        SpinnerComponent,
        DistributionFormComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        NoResultsComponent,
        TooltipAdvancedDirective,
        TooltipAdvancedComponent,
        IconButtonComponent,
        PaginatorComponent,
        EntryFooterComponent,
        CurrencyPipe,
        KeyValuePipe,
        EmptyPipe,
        GenderPipe,
    ],
})
export class EntryDistributionComponent implements OnDestroy {
    public backTitle = $localize`:entry scenarios title:Scenarios`;
    public title = $localize`:entry distribution title:Distribution`;

    public saving = false;

    public state: 'edit' | 'view' = 'edit';
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

    public scenarioUpdateMutation = this.entriesService.updateScenario();

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly routes = ROOT_ROUTE;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyed$ = new Subject<void>();
    private readonly dialog = inject(Dialog);
    private readonly toastr = inject(ToastrService);

    constructor() {
        this.activatedRoute.parent?.params.pipe(
            map((params: Params) => String(params['id'])),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        ).subscribe((id) => {
            if (id) this.entryId.set(id);
        });

        this.activatedRoute.queryParams.pipe(
            takeUntil(this.destroyed$),
            map((params: Params) => getPagingParamsFromQueryParams<WorkersPagingParams>(params, 'workers')),
            distinctUntilChanged(),
        ).subscribe((params) => {
            this.pagingParams.set(params);
        });

        toObservable(this.entry.data).subscribe((entry) => {
            this.state = entry?.scenario?.distribution ? 'view' : 'edit';
        });
    }

    public getWageIncrease(worker: Worker) {
        if (!this.entry.data()) {
            return 0;
        }
        return determineWageIncrease(worker, this.entry.data() as Entry);
    }

    public changeSpecs(): void {
        this.state = 'edit';
    }

    public saveDistribution(distributionForm: DistributionForm): void {
        const entry = this.entry?.data();
        if (!entry) {
            return;
        }

        const mutation: ScenarioUpdateMutation = {
            entryId: entry.id,
            scenarioUpdate: {
                distributions: distributionForm,
            },
        };

        this.scenarioUpdateMutation.mutate(mutation, {
            onSuccess: async () => {
                await this.entriesService.refreshEntry(entry.id);
                await this.entriesService.refreshWorkers(entry.id);
                this.state = 'view';
                this.toastr.success($localize`:distribution-update success:Successfully updated distribution`);
            },
            onError: (error) => {
                console.error(error);
                this.toastr.error($localize`:distribution-update error:Something went wrong updating the distribution`);
            },
        });
    }

    public getDistribution(worker: Worker): Distribution {
        return getWorkerDistribution(worker, this.entry.data() as Entry);
    }

    public isEditted(worker: Worker): boolean {
        const ikb = worker.scenario.distribution?.ikbPerc;
        return ikb !== undefined && ikb !== null;
    }

    public editWorker(worker: Worker) {
        this.dialog.open(WorkerDistributionDialogComponent, {
            data: {
                entry: this.entry.data(),
                worker: worker,
                distribution: this.getDistribution(worker),
            },
        });
    }

    public resetAll() {
        this.dialog.open<ResetWorkersResult, ResetWorkersData, ResetWorkersDialogComponent>(ResetWorkersDialogComponent, {
            data: {
                entry: this.entry.data(),
                type: 'distribution',
            },
        });
    }

    public getTableCaption(total?: number) {
        return $localize`:job-categories table:${ total ?? '-' } job categories`;
    }

    public getTableCaptionSpecs() {
        return $localize`:specs title:Specifications`;
    }

    public getTableCaptionTooltip() {
        return $localize`:distribution:Distribution`;
    }

    public onPageEvent(pageEvent: PageEvent): void {
        const currentParams = this.pagingParams();
        const params = {
            ...currentParams,
            index: pageEvent.page,
            size: pageEvent.pageSize,
        };

        this.router.navigate(
            [MODULE_ROUTE.ENTRIES, this.entryId(), ENTRY_ROUTE.DISTRIBUTION],
            { queryParams: getParamsFromPagingParams<PagingParams>(params) }
        );
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
