import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@core/services';

export interface Account2FAEnableResult {
    enabled: boolean;
}

@Component({
    selector: 'giz-account-enable2-factor-dialog',
    templateUrl: './account-enable2fa-dialog.component.html',
    styleUrl: './account-enable2fa-dialog.component.scss',
})
export class AccountEnable2FaDialogComponent {
    public readonly authService = inject(AuthService);
    public mutation = this.authService.enable2FA();

    private readonly toastr = inject(ToastrService);

    constructor(
        private readonly dialogRef: DialogRef<Account2FAEnableResult>,
    ) {
    }

    get title() {
        return $localize`:2factor-enable title:Enable two-factor authentication`;
    }

    public enable() {
        this.mutation.mutate('todo', {
            onSuccess: () => {
                this.toastr.success($localize`:2factor-enable success:Successfully enabled two-factor authentication`);
                this.dialogRef?.close({ enabled: true });
            },
            onError: () => {
                this.toastr.error($localize`:2factor-enable error:Something went wrong while enabling two-factor authentication`);
                this.dialogRef?.close({ enabled: false });
            },
        });
    }

    public cancel() {
        this.dialogRef?.close({ enabled: false });
    }
}
