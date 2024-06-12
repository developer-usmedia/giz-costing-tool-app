import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

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
    constructor(
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
        this.dialogRef?.close({ reset: true });
    }
}
