import { Component } from '@angular/core';
import { MODULE_ROUTE } from '@core/models';

@Component({
    selector: 'giz-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
})
export class OverviewComponent {
    public readonly moduleRoute = MODULE_ROUTE;

    // TODO: GET ENTRIES
}
