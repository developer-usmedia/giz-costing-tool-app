import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@core/services';

export interface AccountRemoveResult {
    removed: boolean;
}

@Component({
    selector: 'giz-account-remove-dialog',
    templateUrl: './account-remove-dialog.component.html',
    styleUrl: './account-remove-dialog.component.scss',
})
export class AccountRemoveDialogComponent {
    public readonly authService = inject(AuthService);
    public mutation = this.authService.removeAccount();

    private readonly toastr = inject(ToastrService);

    constructor(
        private readonly dialogRef: DialogRef<AccountRemoveResult>,
    ) {
    }

    get title() {
        return $localize`:account-remove title:Remove your account`;
    }

    public remove() {
        this.mutation.mutate('todo', {
            onSuccess: () => {
                this.toastr.success($localize`:account-remove success:Successfully removed your account`);
                this.dialogRef?.close({ removed: true });
            },
            onError: () => {
                this.toastr.error($localize`:account-remove error:Something went wrong while removing your account`);
                this.dialogRef?.close({ removed: false });
            },
        });
    }

    public cancel() {
        this.dialogRef?.close({ removed: false });
    }
}
