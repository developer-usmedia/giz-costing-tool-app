import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

import { BuyerUnit, Entry, EntryUpdateMutation } from '@api/models';
import { EntriesApi } from '@api/services';
import { ENTRY_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { CustomValidators } from '@shared/services';


export interface EntryBuyerForm {
    buyerName: string;
    buyerAmount: number;
    buyerUnit: BuyerUnit;
}

interface EntryBuyerFormGroup {
    facilityProduction: FormControl<number | null>;
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
    public backTitle = $localize`:entry distribution title:Distribution`;
    public title = $localize`:entry buyer title:Buyer`;

    public readonly toastr = inject(ToastrService);
    public readonly router = inject(Router);
    public readonly entriesApi = inject(EntriesApi);
    public readonly entriesService = inject(EntriesService);

    public entryId = signal<string>('');
    public entry = injectQuery<Entry, HttpErrorResponse>(() => ({
        enabled: this.entryId() != '',
        queryKey: ['entry', { id: this.entryId() }],
        queryFn: () => this.entriesApi.getOne(this.entryId()),
        retry: 1,
        staleTime: Infinity,
    }));
    public updateEntryMudation = this.entriesService.updateEntry();
    public saving = this.updateEntryMudation.isPending();

    public form: FormGroup<EntryBuyerFormGroup> = new FormGroup({
        facilityProduction: new FormControl<number | null>(this.entry.data()?.facility?.production?.amount ?? null),
        buyerName: new FormControl<string | null>(null),
        buyerAmount: new FormControl<number | null>(null, {
            validators: [Validators.min(0)],
        }),
        buyerUnit: new FormControl<BuyerUnit | null>(BuyerUnit.UNIT),
    }, { validators: [CustomValidators.buyerAmount] });

    protected readonly icon = ICON;
    protected readonly entryRoute = ENTRY_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
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
                if (id) {
                    this.entryId.set(id);
                }
            });

        toObservable(this.entry.data)
            .pipe(takeUntil(this.destroyed$), distinctUntilChanged())
            .subscribe(() => this.patchForm());
    }


    public getTableCaption() {
        return $localize`:entry-info title:Entry information`;
    }

    public patchForm() {
        if(!this.entry.data()) {
            return;
        }
        const entry = this.entry.data();

        this.form.patchValue({
            facilityProduction: entry?.facility?.production?.amount,
            buyerName: entry?.buyer?.name,
            buyerAmount: entry?.buyer?.proportion?.amount,
            buyerUnit: entry?.buyer?.proportion?.unit ?? BuyerUnit.UNIT,
        });
    }

    public saveEntry(): void {
        this.form.markAllAsTouched();

        if(!this.form.valid) {
            return;
        }

        const formValue = this.form.getRawValue() as EntryBuyerForm;
        const mutation: EntryUpdateMutation = {
            entryId: this.entryId(),
            entryUpdate: {
                buyer: {
                    buyerName: formValue.buyerName === '' ? null : formValue.buyerName,
                    buyerProportion: formValue.buyerAmount,
                    buyerUnit: formValue.buyerUnit,
                },
            },
        };
        this.updateEntryMudation.mutate(mutation, {
            onSuccess: () => {
                this.entriesService.refreshEntry(this.entryId());
                this.router.navigate([this.moduleRoute.ENTRIES, this.entryId(), this.entryRoute.REPORT]);
                this.toastr.success($localize`:buyer-update success:Successfully updated buyer information`);
            },
            onError: (error) => {
                console.error(error);
                this.toastr.error($localize`:buyer-update error:Something went wrong updating the buyer information`);
            },
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
