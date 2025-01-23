import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { EntrySortFilterKey } from '@api/models/entries.model';
import { aboutMarkdown, aboutTitle, howMarkdown, howTitle, intro } from '@core/content/dashboard-content';
import { MODULE_ROUTE, Sort } from '@core/models';
import { EntriesService } from '@core/services';
import {
    CreateEntryDialogComponent,
    CreateEntryResult,
} from '@shared/containers/create-entry-dialog/create-entry-dialog.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { LogosComponent } from '@shared/components/logos/logos.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { EntryCardComponent } from '@shared/components/entry-card/entry-card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { MarkdownPipe } from '@shared/pipes';

@Component({
    selector: 'giz-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [
        DropdownComponent,
        LogosComponent,
        SpinnerComponent,
        EntryCardComponent,
        ButtonComponent,
        RouterLink,
        MarkdownPipe,
    ],
})
export class DashboardComponent {
    public readonly moduleRoute = MODULE_ROUTE;
    public entriesService = inject(EntriesService);
    public entries = this.entriesService.getEntries({
        index: 0,
        size: 3,
        sort: { [EntrySortFilterKey.UPDATED_AT]: Sort.DESC },
    });

    protected readonly aboutMarkdown = aboutMarkdown;
    protected readonly aboutTitle = aboutTitle;
    protected readonly howMarkdown = howMarkdown;
    protected readonly intro = intro;
    protected readonly howTitle = howTitle;

    private readonly dialog = inject(Dialog);
    private dialogCreateRef?: DialogRef<CreateEntryResult, CreateEntryDialogComponent>;

    public createEntry(): void  {
        this.dialogCreateRef = this.dialog.open(CreateEntryDialogComponent, {
            disableClose: true,
        });
    }
}
