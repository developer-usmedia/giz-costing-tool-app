import { Component } from '@angular/core';

import { UserService } from '@core/services/user.service';

@Component({
    selector: 'giz-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    readonly currentUser = this.userService.getUserSession();

    constructor(
        private readonly userService: UserService
    ){}

    getUserJson = () => JSON.stringify(this.currentUser.data());
}
