import { Component, inject } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

import { MODULE_ROUTE } from '@core/models';
import { EntriesService } from '@core/services';
import { Entry } from '@api/models';
import { DeleteEntryResult, EntryDeleteDialogComponent } from '../entry-delete-dialog/entry-delete-dialog.component';

@Component({
    selector: 'giz-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
})
export class OverviewComponent {
    public readonly moduleRoute = MODULE_ROUTE;
    public entriesService = inject(EntriesService);
    public entries = this.entriesService.getEntries({
        index: 0,
        size: 25,
    });

    private readonly dialog = inject(Dialog);
    private readonly dialogRef?: DialogRef<DeleteEntryResult, EntryDeleteDialogComponent>;

    public deleteEntry(entry: Entry) {
        this.dialog.open(EntryDeleteDialogComponent, {
            data: entry,
        });
    }
}
