import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { BuyerUnit, Entry, ScenarioType, WorkerListResponse, WorkersPagingParams } from '@api/models';
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

    get percOfWorkersBelowLivingWage(): number {
        const belowLw = this.entry.data()?.livingWage?.nrOfWorkersBelowLivingWage ?? 0;
        const total = this.entry.data()?.payroll?.nrOfWorkers ?? 0;
        return belowLw / total;
    }

    get percOfWorkersBelowLivingWageScenario(): number {
        const belowLw = this.entry.data()?.scenario?.livingWage?.nrOfWorkersBelowLivingWage ?? 0;
        const total = this.entry.data()?.payroll?.nrOfWorkers ?? 0;
        return belowLw / total;
    }

    get percAvgLivingWageGap(): number {
        const belowLw = this.entry.data()?.livingWage?.avgLivingWageGap ?? 0;
        const total = this.entry.data()?.benchmark.value ?? 0;
        return belowLw / total;
    }

    get percAvgLivingWageGapScenario(): number {
        const belowLw = this.entry.data()?.scenario?.livingWage?.avgLivingWageGap ?? 0;
        const total = this.entry.data()?.benchmark.value ?? 0;
        return belowLw / total;
    }

    get showBuyerColumn(): boolean {
        return this.entry.data()?.buyer?.proportion?.amount !== undefined;
    }

    get buyerPercentage(): number | null {
        const unit = this.entry.data()?.buyer?.proportion?.unit;
        const amount = this.entry.data()?.buyer?.proportion?.amount;
        const amountFacility = this.entry.data()?.facility.production.amount ?? 0;

        if (!amount) {
            return null;
        }

        if (unit === BuyerUnit.PERCENTAGE) {
            return amount;
        }

        return amount / amountFacility * 100;
    }

    get buyerAnnualProduction(): number | null {
        const annualProduction = this.entry.data()?.facility.production.amount;
        if (this.buyerPercentage === null || !annualProduction) {
            return null;
        }
        return annualProduction * (this.buyerPercentage / 100);
    }

    get currencyCode(): string {
        return this.entry.data()?.payroll?.currencyCode ?? '';
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

    public getTableCaptionSpecs() {
        return $localize`:specs title:Specifications`;
    }

    public getTableCaptionDistribution() {
        return $localize`:distribution:Distribution`;
    }

    public getTableCaptionWorkers(total?: number) {
        return $localize`:job-categories table:${ total ?? '-' } job categories`;
    }

    public getTableCaptionComparison() {
        return $localize`:comparison title:Comparison`;
    }

    public getTableCaptionAnnualCosts() {
        return $localize`:annual-costs title:Annual costs`;
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
