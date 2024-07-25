import { Dialog } from '@angular/cdk/dialog';
import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';

import { User } from '@api/models';
import {
    AccountChangePasswordDialogComponent,
    AccountChangePasswordResult,
} from '@core/containers/account-change-password-dialog/account-change-password-dialog.component';
import {
    Account2FADisableResult,
    AccountDisable2FaDialogComponent,
} from '@core/containers/account-disable-2factor-dialog/account-disable2fa-dialog.component';
import {
    Account2FAEnableResult, AccountEnable2FaDialogComponent,
} from '@core/containers/account-enable-2factor-dialog/account-enable2fa-dialog.component';
import {
    AccountRemoveDialogComponent,
    AccountRemoveResult,
} from '@core/containers/account-remove-dialog/account-remove-dialog.component';
import { UserService } from '@core/services';

@Component({
    selector: 'giz-account',
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent {
    public readonly userService = inject(UserService);
    public readonly user: CreateQueryResult<User, Error> = this.userService.getUser();

    private readonly dialog = inject(Dialog);

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
    ) {}

    public removeAccount(): void {
        this.dialog.open<AccountRemoveResult, unknown, AccountRemoveDialogComponent>(
            AccountRemoveDialogComponent,
            {  data: { user: this.user.data() } }
        );
    }

    public changePassword(): void {
        this.dialog.open<AccountChangePasswordResult, unknown, AccountChangePasswordDialogComponent>(
            AccountChangePasswordDialogComponent,
            {  data: { user: this.user.data() } }
        );
    }

    public enable2FA(): void {
        this.dialog.open<Account2FAEnableResult, unknown, AccountEnable2FaDialogComponent>(AccountEnable2FaDialogComponent);
    }

    public disable2FA(): void {
        this.dialog.open<Account2FADisableResult, unknown, AccountDisable2FaDialogComponent>(AccountDisable2FaDialogComponent);
    }

    public getPasswordAge(dateString: string): number | null {
        const oneDay = 1000 * 60 * 60 * 24;
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return null;
        }

        return Math.round((new Date().getTime() - date.getTime()) / oneDay) ;
    }
}
