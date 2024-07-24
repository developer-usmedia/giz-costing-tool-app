import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@core/services';

export interface Account2FADisableResult {
    disabled: boolean;
}

@Component({
    selector: 'giz-account-disable2-factor-dialog',
    templateUrl: './account-disable2fa-dialog.component.html',
    styleUrl: './account-disable2fa-dialog.component.scss',
})
export class AccountDisable2FaDialogComponent {
    public readonly authService = inject(AuthService);
    public mutation = this.authService.disable2FA();

    private readonly toastr = inject(ToastrService);

    constructor(
        private readonly dialogRef: DialogRef<Account2FADisableResult>,
    ) {
    }

    get title() {
        return $localize`:2factor-disable title:Disable two-factor authentication`;
    }

    public disable() {
        this.mutation.mutate('todo', {
            onSuccess: () => {
                this.toastr.success($localize`:2factor-disable success:Successfully disabled two-factor authentication`);
                this.dialogRef?.close({ disabled: true });
            },
            onError: () => {
                this.toastr.error($localize`:2factor-disable error:Something went wrong while disabling two-factor authentication`);
                this.dialogRef?.close({ disabled: false });
            },
        });
    }

    public cancel() {
        this.dialogRef?.close({ disabled: false });
    }
}
