import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { Entry, ScenarioWorkerUpdateMutation, Worker, WorkerDistroForm } from '@api/models';
import { EntriesService } from '@core/services';

interface WorkerDistroFormGroup {
    baseWagePerc: FormControl<number | null>;
    bonusesPerc: FormControl<number | null>;
    ikbPerc: FormControl<number | null>;
    ikbHousingPerc: FormControl<number | null>;
    ikbFoodPerc: FormControl<number | null>;
    ikbTransportPerc: FormControl<number | null>;
    ikbHealthcarePerc: FormControl<number | null>;
    ikbChildcarePerc: FormControl<number | null>;
    ikbChildEducationPerc: FormControl<number | null>;
}

export interface ScenarioWorkerDistroResult {
    update: boolean;
}

// TODO: the form needs to be extracted to a reusable component

@Component({
    selector: 'giz-scenario-worker-distro-dialog',
    templateUrl: './scenario-worker-distro-dialog.component.html',
    styleUrl: './scenario-worker-distro-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ScenarioWorkerDistroDialogComponent implements OnChanges {
    @Input({ required: true }) entry?: Entry;
    @Input() submitting = false;

    public readonly entriesService = inject(EntriesService);
    public readonly toastr = inject(ToastrService);
    public scenarioWorkerUpdateMutation = this.entriesService.updateScenarioWorker();

    public maxIkbPercMapping = {
        baseWagePerc: 100,
        bonusesPerc: 100,
        ikbPerc: 30,
        ikbHousingPerc: 15,
        ikbFoodPerc: 10,
        ikbTransportPerc: 10,
        ikbHealthcarePerc: 10,
        ikbChildcarePerc: 10,
        ikbChildEducationPerc: 10,
    } as const;


    // TODO: baseWage and ikbPerc are now not disabled even though the its specified in the form -> fix;
    public form: FormGroup<WorkerDistroFormGroup> = new FormGroup({
        baseWagePerc: new FormControl<number | null>(
            { value: this.data.worker?.scenario.distribution?.baseWagePerc ?? 100, disabled: true },
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.baseWagePerc)] },
        ),
        bonusesPerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.bonusesPerc ?? 0, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.bonusesPerc), Validators.required],
        }),
        ikbPerc: new FormControl<number | null>(
            { value: this.data.worker?.scenario?.distribution?.ikbPerc ?? 0, disabled: true },
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbPerc)] },
        ),
        ikbHousingPerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.ikbHousingPerc ?? 0, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbHousingPerc), Validators.required],
        }),
        ikbFoodPerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.ikbFoodPerc ?? 0, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbFoodPerc), Validators.required],
        }),
        ikbTransportPerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.ikbTransportPerc ?? 0, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbTransportPerc), Validators.required],
        }),
        ikbHealthcarePerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.ikbHealthcarePerc ?? 0,
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbHealthcarePerc), Validators.required] },
        ),
        ikbChildcarePerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.ikbChildcarePerc ?? 0, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbChildcarePerc), Validators.required],
        }),
        ikbChildEducationPerc: new FormControl<number | null>(
            this.data.worker?.scenario?.distribution?.ikbChildEducationPerc ?? 0,
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbChildEducationPerc), Validators.required] },
        ),
    });

    private readonly destroyed$ = new Subject<void>();

    constructor(
        @Inject(DIALOG_DATA) public data: {
            entry: Entry;
            worker: Worker;
        },
        private readonly dialogRef: DialogRef<ScenarioWorkerDistroResult>,
    ) {
        this.form.valueChanges
        .pipe(
            distinctUntilChanged(),
            takeUntil(this.destroyed$))
        .subscribe((formFields) => {
            this.updateIkbTotal(formFields);
        });
    }

    get title() {
        return $localize`:worker-edit title:Edit distribution for job-category`;
    }

    public updateIkbTotal(fields: Partial<WorkerDistroFormGroup> | Record<string, any>): void {
        /* eslint-disable */
        const computedIkbTotal: number =
            fields.ikbHousingPerc +
            fields.ikbFoodPerc +
            fields.ikbTransportPerc +
            fields.ikbHealthcarePerc +
            fields.ikbChildcarePerc +
            fields.ikbChildEducationPerc;
        /* eslint-enable */

        const computedWage: number = 100 - fields.bonusesPerc - computedIkbTotal;

        this.form.patchValue(
            {
                baseWagePerc: computedWage,
                ikbPerc: computedIkbTotal,
            },
            { emitEvent: false }, // ! anti-infinte loop
        );

        this.form.get('baseWagePerc')?.markAsTouched();
        this.form.get('ikbPerc')?.markAsTouched();
    }

    public patchForm() {
        const {
            baseWagePerc,
            bonusesPerc,
            ikbPerc,
            ikbHousingPerc,
            ikbFoodPerc,
            ikbTransportPerc,
            ikbHealthcarePerc,
            ikbChildcarePerc,
            ikbChildEducationPerc,
        } = this.entry?.scenario?.distribution ?? {};

        this.form.patchValue({
            baseWagePerc: baseWagePerc ?? 0,
            bonusesPerc: bonusesPerc ?? 0,
            ikbPerc: ikbPerc ?? 0,
            ikbHousingPerc: ikbHousingPerc ?? 0,
            ikbFoodPerc: ikbFoodPerc ?? 0,
            ikbTransportPerc: ikbTransportPerc ?? 0,
            ikbHealthcarePerc: ikbHealthcarePerc ?? 0,
            ikbChildcarePerc: ikbChildcarePerc ?? 0,
            ikbChildEducationPerc: ikbChildEducationPerc ?? 0,
        });
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.submitting = true;
            this.form.disable();
            const formValues = this.form.getRawValue();
            this.update(formValues as WorkerDistroForm);
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['worker'] && this.data.worker) {
            this.patchForm();
        }

        if (changes['entry'] && this.entry) {
            this.patchForm();
        }

        if (changes['submitting'] && this.submitting) {
            this.form.disable();
        } else if (changes['submitting'] && !this.submitting) {
            this.form.enable();
        }
    }

    public isButtonDisabled(): boolean {
        return this.scenarioWorkerUpdateMutation.isPending();
    }

    public reset() {
        const form: WorkerDistroForm = {
            bonusesPerc: 0,
            ikbHousingPerc: 0,
            ikbFoodPerc: 0,
            ikbTransportPerc: 0,
            ikbHealthcarePerc: 0,
            ikbChildcarePerc: 0,
            ikbChildEducationPerc: 0,
        };
        this.update(form);
    }

    public cancel() {
        this.dialogRef?.close({ update: false });
    }

    private update(form: WorkerDistroForm) {
        if (!this.data.entry || !this.data.entry.scenario) {
            this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the scenario workers`);
            this.dialogRef?.close({ update: false });
            return;
        }


        const mutation: ScenarioWorkerUpdateMutation = {
            entryId: this.data.entry.id,
            workerId: this.data.worker.id,
            scenarioWorkerUpdate: {
                distribution: form,
            },
        };

        this.scenarioWorkerUpdateMutation.mutate(mutation, {
            onSuccess: () => {
                this.toastr.success($localize`:scenario-worker-update success:Successfully updated the job-category distribution`);
                this.dialogRef?.close({ update: true });
            },
            onError: () => {
                this.toastr.error($localize`:scenario-worker-update error:Something went wrong while updating the job-category distribution`);
                this.dialogRef?.close({ update: false });
            },
        });
    }
}
