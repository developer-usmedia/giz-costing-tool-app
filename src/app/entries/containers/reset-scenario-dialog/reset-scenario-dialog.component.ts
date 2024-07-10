import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import { Entry } from '@api/models';
import { EntriesService } from '@core/services';
import { ToastrService } from 'ngx-toastr';

export interface ResetScenarioData {
    entry?: Entry;
}

export interface ResetScenarioResult {
    reset: boolean;
}

@Component({
    selector: 'giz-reset-scenario-dialog',
    templateUrl: './reset-scenario-dialog.component.html',
    styleUrl: './reset-scenario-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ResetScenarioDialogComponent {
    public readonly entriesService = inject(EntriesService);
    public scenarioDeleteMutation = this.entriesService.deleteScenarioSpecs();

    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(DIALOG_DATA) public data: ResetScenarioData,
        private readonly dialogRef: DialogRef<ResetScenarioResult>,
    ) {
    }

    get title() {
        return $localize`:scenario-reset title:Reset scenario selection?`;
    }

    public cancel() {
        this.dialogRef?.close({ reset: false });
    }

    public reset() {
        if (!this.data.entry) {
            this.toastr.error($localize`:scenario-reset error:Something went wrong while resetting the scenario`);
            this.dialogRef?.close({ reset: false });
            return;
        }

        if (!this.data.entry?.scenario) {
            this.dialogRef?.close({ reset: true });
            return;
        }

        this.scenarioDeleteMutation.mutate(this.data.entry.id, {
            onSuccess: () => {
                this.toastr.success($localize`:scenario-reset success:Successfully reset the scenario`);
                this.dialogRef?.close({ reset: true });
            },
            onError: () => {
                this.toastr.error($localize`:scenario-reset error:Something went wrong while resetting the scenario`);
                this.dialogRef?.close({ reset: false });
            },
        });
    }
}
