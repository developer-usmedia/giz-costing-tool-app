import { APP_BASE_HREF, DecimalPipe, CurrencyPipe, KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { BuyerUnit, Entry, ScenarioType, Worker, WorkerListResponse, WorkersPagingParams } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, PagingParams, ScenarioInfo, SCENARIOS } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import { getPagingParamsFromQueryParams, getParamsFromPagingParams } from '@shared/helpers';
import { EntryHeaderComponent } from '../../components/entry-header/entry-header.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FileDownloadDirective } from '@shared/directives/file-download.directive';
import { NoResultsComponent } from '@shared/components/no-results/no-results.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableRowComponent } from '@shared/components/table-row/table-row.component';
import { TableCellComponent } from '@shared/components/table-cell/table-cell.component';
import { TooltipAdvancedDirective } from '@shared/directives/tooltip-advanced.directive';
import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';
import { ReportWorkersChartComponent } from '../../components/report-workers-chart/report-workers-chart.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { EmptyPipe, GenderPipe } from '@shared/pipes';

@Component({
    selector: 'giz-entry-report',
    templateUrl: './entry-report.component.html',
    styleUrl: './entry-report.component.scss',
    imports: [
        EntryHeaderComponent,
        SpinnerComponent,
        ButtonComponent,
        FileDownloadDirective,
        NoResultsComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        TooltipAdvancedDirective,
        TooltipAdvancedComponent,
        ReportWorkersChartComponent,
        IconButtonComponent,
        TooltipDirective,
        PaginatorComponent,
        DecimalPipe,
        CurrencyPipe,
        KeyValuePipe,
        EmptyPipe,
        GenderPipe,
    ],
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
    public exporting = false;

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
        return belowLw / total * 100;
    }

    get percOfWorkersBelowLivingWageScenario(): number {
        const belowLw = this.entry.data()?.scenario?.livingWage?.nrOfWorkersBelowLivingWage ?? 0;
        const total = this.entry.data()?.payroll?.nrOfWorkers ?? 0;
        return belowLw / total * 100;
    }

    get percAvgLivingWageGap(): number {
        const belowLw = this.entry.data()?.livingWage?.avgLivingWageGap ?? 0;
        const total = this.entry.data()?.benchmark.value ?? 0;
        return belowLw / total * 100;
    }

    get percAvgLivingWageGapScenario(): number {
        const belowLw = this.entry.data()?.scenario?.livingWage?.avgLivingWageGap ?? 0;
        const total = this.entry.data()?.benchmark.value ?? 0;
        return belowLw / total * 100;
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
            [MODULE_ROUTE.ENTRIES, this.entryId(), ENTRY_ROUTE.REPORT],
            { queryParams: getParamsFromPagingParams<PagingParams>(params) }
        );
    }

    public getReportDownloadUrl(): string {
        return this.entriesApi.getExportUrl(this.entryId());
    }

    public getFileDownloadError(): string {
        return $localize`:report-download error:Download report failed`;
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

    public getTooltipStatusQuo() {
        return $localize`:status-quo tooltip:Current remuneration and living wage gap`;
    }

    public getTooltipScenario() {
        return $localize`:scenario tooltip:Remuneration and living wage gap after applying the scenario`;
    }

    public setExporting(value: boolean): void {
        this.exporting = value;
    }

    public isBelowLw(worker: Worker): boolean {
        const lw = worker?.scenario?.livingWage?.livingWageGapPerc ?? 0;
        return Math.round((lw + Number.EPSILON) * 100) / 100 > 0;
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
