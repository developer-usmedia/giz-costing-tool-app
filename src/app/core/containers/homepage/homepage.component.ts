import { Component } from '@angular/core';
import { AUTH_ROUTE } from '@core/models';

@Component({
    selector: 'giz-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
    protected readonly authRoute = AUTH_ROUTE;
}
