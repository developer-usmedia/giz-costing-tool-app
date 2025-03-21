import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Entry, ScenarioWorkerForm, ScenarioWorkerUpdateMutation, Worker } from '@api/models';
import { EntriesService } from '@core/services';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { NgClass, CurrencyPipe } from '@angular/common';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { GenderPipe, HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface ScenarioWorkerSpecsFormGroup {
    remunerationIncrease: FormControl<number | null>;
}

export interface ScenarioWorkerSpecsResult {
    update: boolean;
}

@Component({
    selector: 'giz-worker-scenario-specs-dialog',
    templateUrl: './worker-scenario-specs-dialog.component.html',
    styleUrl: './worker-scenario-specs-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        DialogComponent,
        ReactiveFormsModule,
        NgClass,
        AlertComponent,
        ButtonComponent,
        SpinnerComponent,
        CurrencyPipe,
        GenderPipe,
        HasErrorPipe,
        HasValuePipe,
    ],
})
export class WorkerScenarioSpecsDialogComponent implements OnChanges {
    public readonly entriesService = inject(EntriesService);
    public scenarioUpdateWorkerMutation = this.entriesService.updateScenarioWorker();

    public form: FormGroup<ScenarioWorkerSpecsFormGroup> = new FormGroup(
        {
            remunerationIncrease: new FormControl<number | null>(
                this.data.worker?.scenario?.specification?.remunerationIncrease ?? null,
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

    get remunerationIncrease(): AbstractControl | null {
        return this.form.controls.remunerationIncrease;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['worker'] && this.data.worker) {
            this.patchForm();
        }
    }

    public patchForm() {
        const remunerationIncrease = this.data.worker?.scenario?.specification?.remunerationIncrease;
        if (remunerationIncrease !== undefined && remunerationIncrease !== null) {
            this.form.patchValue({
                remunerationIncrease: remunerationIncrease,
            });
        }
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.form.disable();
            const formValue = this.form.getRawValue();

            this.update(formValue as ScenarioWorkerForm);
        }
    }

    public reset() {
        const form: ScenarioWorkerForm = {
            remunerationIncrease: null,
        };
        this.update(form);
    }

    public cancel() {
        this.dialogRef?.close({ update: false });
    }

    private update(form: ScenarioWorkerForm) {
        if (!this.data.entry || !this.data.entry.scenario) {
            this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the scenario workers`);
            this.dialogRef?.close({ update: false });
            return;
        }

        const mutation: ScenarioWorkerUpdateMutation = {
            entryId: this.data.entry.id,
            workerId: this.data.worker.id,
            scenarioWorkerUpdate: form,
        };

        this.scenarioUpdateWorkerMutation.mutate(mutation, {
            onSuccess: () => {
                this.toastr.success($localize`:scenario-worker-update success:Successfully updated the job-category`);
                this.dialogRef?.close({ update: true });
            },
            onError: () => {
                this.toastr.error($localize`:scenario-worker-update error:Something went wrong while updating the job-category`);
                this.dialogRef?.close({ update: false });
            },
        });
    }
}
