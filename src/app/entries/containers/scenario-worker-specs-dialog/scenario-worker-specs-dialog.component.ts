import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    inject,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Entry, ScenarioWorkerSpecsForm, ScenarioWorkerUpdateMutation, Worker } from '@api/models';
import { EntriesService } from '@core/services';

interface ScenarioWorkerSpecsFormGroup {
    absoluteIncrease: FormControl<number | null>;
}

export interface ScenarioWorkerSpecsResult {
    update: boolean;
}

@Component({
    selector: 'giz-scenario-worker-specs-dialog',
    templateUrl: './scenario-worker-specs-dialog.component.html',
    styleUrl: './scenario-worker-specs-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ScenarioWorkerSpecsDialogComponent implements OnChanges {
    public readonly entriesService = inject(EntriesService);
    public scenarioUpdateWorkerMutation = this.entriesService.updateScenarioWorker();

    public form: FormGroup<ScenarioWorkerSpecsFormGroup> = new FormGroup(
        {
            absoluteIncrease: new FormControl<number | null>(
                this.data.worker?.absoluteIncrease ?? null,
                {
                    validators: [
                        Validators.required,
                        Validators.min(0),
                    ],
                },
            ),
        },
    );

    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(DIALOG_DATA) public data: {
            entry: Entry;
            worker: Worker;
        },
        private readonly dialogRef: DialogRef<ScenarioWorkerSpecsResult>,
    ) {
    }

    get title() {
        return $localize`:worker-edit title:Edit scenario for job-category`;
    }

    get absoluteIncrease(): AbstractControl | null {
        return this.form.controls.absoluteIncrease;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['worker'] && this.data.worker) {
            this.patchForm();
        }
    }

    public patchForm() {
        const absoluteIncrease = this.data.worker?.absoluteIncrease;
        if (absoluteIncrease !== undefined && absoluteIncrease !== null) {
            this.form.patchValue({
                absoluteIncrease: absoluteIncrease,
            });
        }
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.form.disable();
            const formValue = this.form.getRawValue();

            this.update(formValue as ScenarioWorkerSpecsForm);
        }
    }

    public reset() {
        const form: ScenarioWorkerSpecsForm = {
            absoluteIncrease: null,
        };
        this.update(form);
    }

    public cancel() {
        this.dialogRef?.close({ update: false });
    }

    private update(form: ScenarioWorkerSpecsForm) {
        if (!this.data.entry || !this.data.entry.scenario) {
            this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the scenario workers`);
            this.dialogRef?.close({ update: false });
            return;
        }

        const mutation: ScenarioWorkerUpdateMutation = {
            entryId: this.data.entry.id,
            workerId: this.data.worker.id,
            scenarioWorkerSpecsUpdate: form,
        };

        this.scenarioUpdateWorkerMutation.mutate(mutation, {
            onSuccess: () => {
                this.toastr.error($localize`:scenario-worker-update success:Successfully update the job-category`);
                this.dialogRef?.close({ update: true });
            },
            onError: (error) => {
                this.toastr.error($localize`:scenario-worker-update error:Something went wrong while updating the job-category`, error.message);
                this.dialogRef?.close({ update: false });
            },
        });
    }
}
