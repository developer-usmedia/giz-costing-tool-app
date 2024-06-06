import { Component } from '@angular/core';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { AuthService } from '@core/services';

@Component({
    selector: 'giz-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
    public loggedIn = this.authService.isLoggedIn();

    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly routRoute = ROOT_ROUTE;

    constructor(
        private readonly authService: AuthService,
    ) {
    }
}
