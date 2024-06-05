import { Component } from '@angular/core';

import { MODULE_ROUTE } from '@core/models';
import { Entry } from '@api/models';
import { EntriesService } from '@core/services/entries.service';

@Component({
    selector: 'giz-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    public readonly moduleRoute = MODULE_ROUTE;
    public entries?: Entry[];

    constructor(
        private readonly entriesService: EntriesService,
    ) {
        // TODO: replace with real entries
        this.entries = [
            this.entriesService.getEntry('bd101a34-0438-4065-b84c-a4efc7258204'),
            this.entriesService.getEntry('bd101a34-0438-4065-b84c-a4efc7258204'),
            this.entriesService.getEntry('bd101a34-0438-4065-b84c-a4efc7258204'),
        ];
    }
}
