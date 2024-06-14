import { Component, OnInit, inject } from '@angular/core';

import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { AuthService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
  selector: 'giz-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly icon = ICON;

    private readonly authService = inject(AuthService);

    get title(): string {
        return $localize`:logout title:Logged out`;
    }

    get description(): string {
        return $localize`:logout description:You have successfully logged out`;
    }

    public ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.authService.logout();
        }
    }
}
