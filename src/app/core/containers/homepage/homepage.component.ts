import { Component } from '@angular/core';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { AUTH_COOKIE_NAME } from '@api/models';

@Component({
    selector: 'giz-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
    public loggedIn = document.cookie.includes(AUTH_COOKIE_NAME);

    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly routRoute = ROOT_ROUTE;
}
