import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Entry } from '@api/models';
import { EntriesService } from '@core/services';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { EntryCardComponent } from '@shared/components/entry-card/entry-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface DeleteEntryResult {
    deleted: boolean;
}

@Component({
    selector: 'giz-entry-delete-dialog',
    templateUrl: './entry-delete-dialog.component.html',
    styleUrl: './entry-delete-dialog.component.scss',
    imports: [
        DialogComponent,
        EntryCardComponent,
        SpinnerComponent,
        ButtonComponent,
    ],
})
export class EntryDeleteDialogComponent {
    public entriesService = inject(EntriesService);
    public entryMutation = this.entriesService.deleteEntry();

    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(DIALOG_DATA) public entry: Entry,
        private readonly dialogRef: DialogRef<DeleteEntryResult>,
    ) {
    }

    get title() {
        return $localize`:entry-delete title:Delete entry?`;
    }

    public cancel() {
        this.dialogRef?.close({ deleted: false });
    }

    public delete() {
        this.entryMutation.mutate(this.entry.id, {
            onSuccess: () => {
                this.toastr.success($localize`:entry-delete success:Your entry has been successfully deleted`);
                this.dialogRef?.close({ deleted: true });
            },
            onError: () => {
                this.toastr.error($localize`:entry-delete error:Something went wrong deleting the entry`);
                this.dialogRef?.close({ deleted: false });
            },
        });
    }
}
