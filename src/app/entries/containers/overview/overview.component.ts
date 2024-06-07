import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { Entry } from '@api/models';
import { MODULE_ROUTE } from '@core/models';
import { EntriesService } from '@core/services';
import {
    CreateEntryDialogComponent,
    CreateEntryResult,
} from '@shared/containers/create-entry-dialog/create-entry-dialog.component';
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
    private dialogCreateRef?: DialogRef<CreateEntryResult, CreateEntryDialogComponent>;
    private dialogDeleteRef?: DialogRef<DeleteEntryResult, EntryDeleteDialogComponent>;

    public createEntry(): void  {
        this.dialogCreateRef = this.dialog.open(CreateEntryDialogComponent, {
            disableClose: true,
        });
    }

    public deleteEntry(entry: Entry) {
        this.dialogDeleteRef = this.dialog.open(EntryDeleteDialogComponent, {
            data: entry,
        });
    }
}
