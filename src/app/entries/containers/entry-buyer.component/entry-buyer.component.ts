import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EntriesService } from '@core/services';
import { getPagingParamsFromQueryParams } from '@shared/helpers';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuyerUnit, Entry, ScenarioType, WorkersPagingParams } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';

interface EntryBuyerFormGroup {
    buyerName: FormControl<string | null>;
    buyerAmount: FormControl<number | null>;
    buyerUnit: FormControl<BuyerUnit | null>;
}

@Component({
    selector: 'giz-entry-buyer',
    templateUrl: './entry-buyer.component.html',
    styleUrl: './entry-buyer.component.scss',
})
export class EntryBuyerComponent implements OnDestroy {
    public backTitle = $localize`:entry scenarios title:Scenarios`;
    public title = $localize`:entry buyer title:Buyer`;
    public submitting: any;
    public saving = false; // Replace with angular query mutationstatus

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

    public updateEntryMudation = this.entriesService.updateEntry();

    public form: FormGroup<EntryBuyerFormGroup> = new FormGroup({
        buyerName: new FormControl<string | null>(this.entry.data()?.buyer?.name ?? null, {
            validators: [Validators.required],
        }),
        buyerAmount: new FormControl<number | null>(this.entry.data()?.buyer?.proportion.amount ?? null, {
            validators: [Validators.required],
        }),
        buyerUnit: new FormControl<BuyerUnit | null>(this.entry.data()?.buyer?.proportion.unit ?? null, {
            validators: [Validators.required],
        }),
    });

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly scenarioType = ScenarioType;
    protected readonly routes = ROOT_ROUTE;
    protected readonly buyerUnits = Object.values(BuyerUnit);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyed$ = new Subject<void>();
    
    constructor() {
        this.activatedRoute.parent?.params
            .pipe(
                map((params: Params) => String(params['id'])),
                takeUntil(this.destroyed$),
                distinctUntilChanged(),
            )
            .subscribe((id) => {
                if (id) this.entryId.set(id);
            });

        this.activatedRoute.queryParams
            .pipe(
                takeUntil(this.destroyed$),
                map((params: Params) => getPagingParamsFromQueryParams<WorkersPagingParams>(params, 'workers')),
                distinctUntilChanged(),
            )
            .subscribe((params) => {
                this.pagingParams.set(params);
            });
    }

    public submit(): void {
        this.saving = true;
        this.submitting = true;



        if (this.form.valid && this.entry.data()) {
            this.submitting = true;
            this.form.disable();
            // const formValue = this.form.getRawValue();

            // const mutation: EntryUpdateMutation = {
            //     entryId: this.entry.data()?.id as string,
            //     entryUpdate: {
            //         // buyer: {
            //         //     buyerName: this
            //         //     buyerProportion: number;
            //         //     buyerUnit: BuyerUnit
            //         // },
            //     },
            // };

            // this.scenarioUpdateMutation.mutate(mutation, {
            //     onSuccess: () => {
            //         this.state = 'view';
            //         this.toastr.success($localize`:distribution-update success:Successfully updated distribution`);
            //     },
            //     onError: (error) => {
            //         console.error(error);
            //         this.toastr.error($localize`:distribution-update error:Something went wrong updating the distribution`);
            //     },
            // });
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
