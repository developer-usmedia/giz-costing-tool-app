import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject, inject, signal, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Distribution, DistributionForm, Entry, ScenarioWorkerUpdateMutation, Worker } from '@api/models';
import { EntriesService } from '@core/services';

export interface ScenarioWorkerDistroResult {
    update: boolean;
}

@Component({
    selector: 'giz-worker-distribution-dialog',
    templateUrl: './worker-distribution-dialog.component.html',
    styleUrl: './worker-distribution-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class WorkerDistributionDialogComponent {
    public readonly entriesService = inject(EntriesService);
    public readonly toastr = inject(ToastrService);
    public scenarioWorkerUpdateMutation = this.entriesService.updateScenarioWorker();
    public submitEvent = signal<boolean>(false);

    constructor(
        @Inject(DIALOG_DATA) public data: {
            entry: Entry;
            worker: Worker;
            distribution: Distribution;
        },
        private readonly dialogRef: DialogRef<ScenarioWorkerDistroResult>,
    ) {
    }

    get title() {
        return $localize`:worker-edit title:Edit distribution for job-category`;
    }

    public isPending(): boolean {
        return this.scenarioWorkerUpdateMutation.isPending();
    }

    public reset() {
        const form: DistributionForm = {
            bonusesPerc: null,
            ikbHousingPerc: null,
            ikbFoodPerc: null,
            ikbTransportPerc: null,
            ikbHealthcarePerc: null,
            ikbChildcarePerc: null,
            ikbChildEducationPerc: null,
        };
        this.update(form);
    }

    public cancel() {
        this.dialogRef?.close({ update: false });
    }

    public submit() {
        this.submitEvent.set(true);
    }

    public update(form: DistributionForm) {
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
