import { Component, inject, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Entry } from '@api/models';
import { ToastrService } from 'ngx-toastr';
import { EntriesService } from '@core/services';

export interface DeleteEntryResult {
    deleted: boolean;
}

@Component({
    selector: 'giz-entry-delete-dialog',
    templateUrl: './entry-delete-dialog.component.html',
    styleUrl: './entry-delete-dialog.component.scss',
})
export class EntryDeleteDialogComponent {
    public entriesService = inject(EntriesService);
    public entryMutation = this.entriesService.deleteEntry();

    private readonly toastr = inject(ToastrService);

    constructor(
        @Inject(DIALOG_DATA) public entry: Entry,
        private readonly dialogRef: DialogRef,
    ) {
    }

    get title() {
        return $localize`:entry-delete title:Delete entry?`;
    }

    public cancel() {
        this.dialogRef?.close({ delete: false });
    }

    public delete() {
        this.entryMutation.mutate(this.entry.id, {
            onSuccess: () => {
                this.dialogRef?.close({ deleted: true });
            },
            onError: (error) => {
                this.toastr.error($localize`:entry-delete error:Something went wrong deleting the entry`, error.message);
                this.dialogRef?.close({ deleted: false });
            },
        });
    }
}
