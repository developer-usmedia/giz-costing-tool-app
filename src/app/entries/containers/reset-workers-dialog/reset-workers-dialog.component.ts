import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Entry, ScenarioWorkersResetMutation } from '@api/models';
import { EntriesService } from '@core/services';

export interface ResetWorkersResult {
    reset: boolean;
}

@Component({
    selector: 'giz-reset-workers-dialog',
    templateUrl: './reset-workers-dialog.component.html',
    styleUrl: './reset-workers-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ResetWorkersDialogComponent {
    public readonly entriesService = inject(EntriesService);
    public scenarioResetWorkersMutation = this.entriesService.resetScenarioWorkers();

    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(DIALOG_DATA) public entry: Entry,
        private readonly dialogRef: DialogRef<ResetWorkersResult>,
    ) {
    }

    get title() {
        return $localize`:workers-reset-all title:Reset all job-categories?`;
    }

    public cancel() {
        this.dialogRef?.close({ reset: false });
    }

    public reset() {
        if (!this.entry || !this.entry.scenario) {
            this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the job-categories`);
            this.dialogRef?.close({ reset: false });
            return;
        }

        const mutation: ScenarioWorkersResetMutation = {
            entryId: this.entry.id,
            scenarioWorkersReset: { reset: 'specifications' },
        };

        this.scenarioResetWorkersMutation.mutate(mutation, {
            onSuccess: () => {
                this.toastr.error($localize`:scenario-workers-reset success:Successfully reset the job-categories`);
                this.dialogRef?.close({ reset: true });
            },
            onError: (error) => {
                this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the job-categories`, error.message);
                this.dialogRef?.close({ reset: false });
            },
        });
    }
}
