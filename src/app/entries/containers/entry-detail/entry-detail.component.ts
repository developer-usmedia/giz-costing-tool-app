import { Component } from '@angular/core';

import { ENTRY_ROUTE } from '@core/models';

@Component({
    selector: 'giz-entry-detail',
    templateUrl: './entry-detail.component.html',
    styleUrl: './entry-detail.component.scss',
})
export class EntryDetailComponent {
    public readonly entryRoute = ENTRY_ROUTE;
}
