import { Component, inject } from '@angular/core';

import { MODULE_ROUTE } from '@core/models';
import { EntriesService } from '@core/services';

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
    });
}
