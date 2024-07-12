import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { determineWageIncrease } from '@api/helpers/worker.helper';
import { Entry, ScenarioType, Worker, WorkerListResponse, WorkersPagingParams } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, PagingParams, ScenarioInfo, SCENARIOS } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import { getPagingParamsFromQueryParams, getParamsFromPagingParams } from '@shared/helpers';

@Component({
    selector: 'giz-entry-report',
    templateUrl: './entry-report.component.html',
    styleUrl: './entry-report.component.scss',
})
export class EntryReportComponent implements OnDestroy {
    public backTitle = $localize`:entry buyer title:Buyer`;
    public title = $localize`:entry report title:Report`;

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

    public scenarios: ScenarioInfo[] = SCENARIOS;
    public activeScenario?: ScenarioInfo;

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly scenarioType = ScenarioType;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyed$ = new Subject<void>();
    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
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
            this.activeScenario = this.scenarios.find(scenario => scenario.type === entry?.scenario?.type);
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

    public getTableCaption(total?: number) {
        return $localize`:job-categories table:${ total ?? '-' } job categories`;
    }

    public getTableCaptionSpecs() {
        return $localize`:specs title:Specifications`;
    }

    public getWageIncrease(worker: Worker) {
        if (!this.entry.data()) {
            return 0;
        }
        return determineWageIncrease(worker, this.entry.data() as Entry);
    }

    public download(): void {
        // TOOD: DOWNLOAD
        this.toastr.error($localize`:report-download error:Download report failed`);
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
