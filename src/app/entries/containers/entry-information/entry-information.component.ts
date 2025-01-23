import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { Entry } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { EntryHeaderComponent } from '../../components/entry-header/entry-header.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NoResultsComponent } from '@shared/components/no-results/no-results.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableRowComponent } from '@shared/components/table-row/table-row.component';
import { TableCellComponent } from '@shared/components/table-cell/table-cell.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { UpperCasePipe, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { CountryNamePipe, EmptyPipe, VerifiedPipe } from '@shared/pipes';

@Component({
    selector: 'giz-entry-information',
    templateUrl: './entry-information.component.html',
    styleUrl: './entry-information.component.scss',
    imports: [
        EntryHeaderComponent,
        ButtonComponent,
        RouterLink,
        SpinnerComponent,
        NoResultsComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        IconButtonComponent,
        CdkCopyToClipboard,
        UpperCasePipe,
        DecimalPipe,
        CurrencyPipe,
        DatePipe,
        CountryNamePipe,
        EmptyPipe,
        VerifiedPipe,
    ],
})
export class EntryInformationComponent implements OnDestroy {
    public backTitle = $localize`:entry back-to-overview:Back to overview`;
    public title = $localize`:entry information title:Information`;

    public entriesApi = inject(EntriesApi);
    public entryId = signal<string>('');
    public entry = injectQuery<Entry, HttpErrorResponse>(() => ({
        enabled: this.entryId() != '',
        queryKey: ['entry', { id: this.entryId() }],
        queryFn: () => this.entriesApi.getOne(this.entryId()),
        retry: 1,
        staleTime: Infinity,
    }));

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyed$ = new Subject<void>();

    constructor() {
        this.activatedRoute.params.pipe(
            map((params: Params) => String(params['id'])),
            takeUntil(this.destroyed$),
            distinctUntilChanged(),
        ).subscribe((id) => {
            if (id) {
                this.entryId.set(id);
            }
        });
    }

    get currencyCode(): string {
        return this.entry.data()?.payroll?.currencyCode ?? '';
    }

    get captionGeneral() {
        return $localize`:entry general title:General`;
    }

    get captionProductionInfo() {
        return $localize`:entry product-information title:Product information`;
    }

    get captionPayroll() {
        return $localize`:entry payroll title:Payroll`;
    }

    get captionSalaryMatrix() {
        return $localize`:entry salary-matrix title:Salary Matrix`;
    }

    get captionBenchmark() {
        return $localize`:entry benchmark title:Benchmark`;
    }

    get captionEntry() {
        return $localize`:entry entry title:Entry`;
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
