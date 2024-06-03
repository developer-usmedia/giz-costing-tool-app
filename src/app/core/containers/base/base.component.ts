import { Component } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { UserResponse } from '@api/models';

@Component({
    selector: 'giz-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
    public readonly userSession: CreateQueryResult<UserResponse, Error> = this.userService.getUserSession();
    public readonly user = this.userSession.data()?.user;

    constructor(
        private readonly userService: UserService,
    ) {}
}
