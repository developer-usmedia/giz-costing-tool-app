import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Observable, startWith, Subject, take, takeUntil } from 'rxjs';

import { Entry } from '@api/models';
import {
    defaultEntriesSortKey,
    EntriesListResponse,
    EntriesPagingParams,
    EntrySortFilterKey,
} from '@api/models/entries.model';
import { EntriesApi } from '@api/services';
import { MODULE_ROUTE, ROOT_ROUTE, Sort } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import {
    CreateEntryDialogComponent,
    CreateEntryResult,
} from '@shared/containers/create-entry-dialog/create-entry-dialog.component';
import { getPagingParamsFromQueryParams, getParamsFromPagingParams } from '@shared/helpers';
import { DeleteEntryResult, EntryDeleteDialogComponent } from '../entry-delete-dialog/entry-delete-dialog.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { MenuItemComponent } from '@shared/components/menu-item/menu-item.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NoResultsComponent } from '@shared/components/no-results/no-results.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableRowComponent } from '@shared/components/table-row/table-row.component';
import { TableCellComponent } from '@shared/components/table-cell/table-cell.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { StatusComponent } from '@shared/components/status/status.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { AsyncPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { CountryNamePipe, EmptyPipe, EntryStatusPipe, EntryStatusTextPipe } from '@shared/pipes';

@Component({
    selector: 'giz-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        ButtonComponent,
        IconButtonComponent,
        CdkMenuTrigger,
        CdkMenu,
        MenuComponent,
        CdkMenuItem,
        MenuItemComponent,
        SpinnerComponent,
        NoResultsComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        RouterLink,
        TooltipDirective,
        StatusComponent,
        PaginatorComponent,
        AsyncPipe,
        DatePipe,
        KeyValuePipe,
        CountryNamePipe,
        EmptyPipe,
        EntryStatusPipe,
        EntryStatusTextPipe,
    ],
})
export class OverviewComponent implements OnDestroy {
    public pagingParams$: Observable<EntriesPagingParams>;
    public pagingParams = signal<EntriesPagingParams | undefined>(undefined);
    public entriesApi = inject(EntriesApi);
    public entries? = injectQuery<EntriesListResponse, HttpErrorResponse>(() => ({
        enabled: this.pagingParams() != undefined,
        queryKey: ['entries', this.pagingParams()],
        queryFn: () => this.entriesApi.getMany(this.pagingParams()),
        retry: 1,
        staleTime: Infinity,
    }));

    public readonly moduleRoute = MODULE_ROUTE;
    public actionsMenuPosition: ConnectedPosition[] = [{
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 10,
    }];

    protected readonly routes = ROOT_ROUTE;
    protected readonly icon = ICON;
    protected readonly entrySortKeys = EntrySortFilterKey;
    protected readonly sortValue = Sort;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(Dialog);
    private dialogCreateRef?: DialogRef<CreateEntryResult, CreateEntryDialogComponent>;
    private dialogDeleteRef?: DialogRef<DeleteEntryResult, EntryDeleteDialogComponent>;
    private readonly destroyed = new Subject();

    constructor()
    {
        this.pagingParams$ = this.activatedRoute.queryParams.pipe(
            takeUntil(this.destroyed),
            map((params: Params) => getPagingParamsFromQueryParams<EntriesPagingParams>(params, 'entries')),
            map((params: EntriesPagingParams) => {
                if (params?.sort && Object.keys(params.sort).length > 0) {
                    const sort = { ...params.sort } as Record<string, (Sort.ASC | Sort.DESC) >;
                    for (const key of Object.keys(params.sort)) {
                        if (!(Object.values(EntrySortFilterKey) as string[]).includes(key)) {
                            delete sort[key];
                        }
                    }
                    params.sort = sort;
                }

                return params;
            }),
            distinctUntilChanged(),
        );

        this.pagingParams$.subscribe((params) => {
            this.pagingParams.set(params);
        });
    }

    public isActiveSort(key: EntrySortFilterKey): Observable<boolean> {
        return this.pagingParams$.pipe(
            take(1),
            map((params) => {
                if (params?.sort && Object.keys(params.sort).length > 0) {
                    return Object.prototype.hasOwnProperty.call(params?.sort, key);
                } else {
                    return key === defaultEntriesSortKey;
                }
            }),
            startWith(false),
        );
    }

    public sort(sortKey: EntrySortFilterKey, sort: Sort): void {
        this.pagingParams$
            .pipe(take(1))
            .subscribe((currentParams) => {
                const params = {
                    ...currentParams,
                    sort: {[sortKey]: sort },
                };

                this.router.navigate(
                    [MODULE_ROUTE.ENTRIES],
                    { queryParams: getParamsFromPagingParams<EntriesPagingParams>(params) }
                );
            });
    }

    public onPageEvent(pageEvent: PageEvent): void {
        this.pagingParams$
            .pipe(take(1))
            .subscribe((currentParams) => {
                const params = {
                    ...currentParams,
                    index: pageEvent.page,
                    size: pageEvent.pageSize,
                };

                this.router.navigate(
                    [MODULE_ROUTE.ENTRIES],
                    { queryParams: getParamsFromPagingParams<EntriesPagingParams>(params) }
                );
            });
    }

    public createEntry(): void {
        this.dialogCreateRef = this.dialog.open(CreateEntryDialogComponent, {
            disableClose: true,
        });
    }

    public deleteEntry(entry: Entry) {
        this.dialogDeleteRef = this.dialog.open(EntryDeleteDialogComponent, {
            data: entry,
        });
    }

    public getTableCaption(total?: number) {
        return $localize`:entries table:${ total ?? '-' } entries`;
    }

    public onClickActions(event: Event): void {
        event.stopPropagation();
    }

    public ngOnDestroy(): void {
        this.destroyed.next(true);
        this.destroyed.complete();
    }
}
