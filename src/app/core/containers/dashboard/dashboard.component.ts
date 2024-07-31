import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { EntrySortFilterKey } from '@api/models/entries.model';
import { MODULE_ROUTE, ROOT_ROUTE, Sort } from '@core/models';
import { EntriesService } from '@core/services';
import {
    CreateEntryDialogComponent,
    CreateEntryResult,
} from '@shared/containers/create-entry-dialog/create-entry-dialog.component';

@Component({
    selector: 'giz-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    public readonly moduleRoute = MODULE_ROUTE;
    public entriesService = inject(EntriesService);
    public entries = this.entriesService.getEntries({
        index: 0,
        size: 3,
        sort: { [EntrySortFilterKey.UPDATED_AT]: Sort.DESC },
    });

    protected readonly rootRoute = ROOT_ROUTE;

    private readonly dialog = inject(Dialog);
    private dialogCreateRef?: DialogRef<CreateEntryResult, CreateEntryDialogComponent>;

    public createEntry(): void  {
        this.dialogCreateRef = this.dialog.open(CreateEntryDialogComponent, {
            disableClose: true,
        });
    }

    public getMarkdown() {
        return $localize`:homepage body:
On many farms or plantations, at least some workers do not earn a living wage. There is a gap between the actual wage paid and a living wage. If at least some workers on a farm or plantation do not receive a living wage, there are various ways to close the gap between the actual wage paid and a living wage: Strong trade unions and workers' representatives are an important lever to work towards improved wage and working conditions in the long term within the framework of collective agreements. Companies can also make a proactive contribution through their procurement practices and reward producers for high wage and labour standards. For example, through an additional price premium to cover the extra costs of paying living wages.

In order to advance the payment of living wages, GIZ developed the Living Wage Costing Tool. Based on the output of the IDH Salary Matrix the GIZ Living Wage Costing Tool provides various calculations to help you analyse the direct cost implications for producers to pay workers a living wage. It therefore allows the producer to determine additional costs of paying a living wage at farm level.
`;
    }
}
