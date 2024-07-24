import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@core/services';

export interface AccountChangePasswordResult {
    updated: boolean;
}

@Component({
    selector: 'giz-account-change-password-dialog',
    templateUrl: './account-change-password-dialog.component.html',
    styleUrl: './account-change-password-dialog.component.scss',
})
export class AccountChangePasswordDialogComponent {
    public readonly authService = inject(AuthService);
    public mutation = this.authService.changePassword();

    private readonly toastr = inject(ToastrService);

    constructor(
        private readonly dialogRef: DialogRef<AccountChangePasswordResult>,
    ) {
    }

    get title() {
        return $localize`:change-password title:Change your password`;
    }

    public update() {
        this.mutation.mutate('todo', {
            onSuccess: () => {
                this.toastr.success($localize`:change-password success:Successfully changed password`);
                this.dialogRef?.close({ updated: true });
            },
            onError: () => {
                this.toastr.error($localize`:change-password error:Something went wrong changing your password`);
                this.dialogRef?.close({ updated: false });
            },
        });
    }

    public cancel() {
        this.dialogRef?.close({ updated: false });
    }
}
