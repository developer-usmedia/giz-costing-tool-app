import { Component, inject } from '@angular/core';

import { MODULE_ROUTE } from '@core/models';
import { EntriesService } from '@core/services/entries.service';

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
}
