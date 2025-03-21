import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Entry, ScenarioWorkersResetMutation } from '@api/models';
import { EntriesService } from '@core/services';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface ResetWorkersData {
    entry?: Entry;
    type: 'specification' | 'distribution' | 'all';
}

export interface ResetWorkersResult {
    reset: boolean;
}

@Component({
    selector: 'giz-reset-workers-dialog',
    templateUrl: './reset-workers-dialog.component.html',
    styleUrl: './reset-workers-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        DialogComponent,
        SpinnerComponent,
        ButtonComponent,
    ],
})
export class ResetWorkersDialogComponent {
    public readonly entriesService = inject(EntriesService);
    public scenarioResetWorkersMutation = this.entriesService.resetScenarioWorkers();

    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(DIALOG_DATA) public data: ResetWorkersData,
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
        if (!this.data.entry || !this.data.entry?.scenario) {
            this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the job-categories`);
            this.dialogRef?.close({ reset: false });
            return;
        }

        const mutation: ScenarioWorkersResetMutation = {
            entryId: this.data.entry.id,
            scenarioWorkersReset: { type: this.data.type },
        };

        this.scenarioResetWorkersMutation.mutate(mutation, {
            onSuccess: () => {
                this.toastr.success($localize`:scenario-workers-reset success:Successfully reset the job-categories`);
                this.dialogRef?.close({ reset: true });
            },
            onError: () => {
                this.toastr.error($localize`:scenario-workers-reset error:Something went wrong while resetting the job-categories`);
                this.dialogRef?.close({ reset: false });
            },
        });
    }
}
