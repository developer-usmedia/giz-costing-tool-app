import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { ErrorResponse, User } from '@api/models';
import { AuthService } from '@core/services';
import { STATUS } from '@shared/helpers';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface AccountRemoveFormGroup {
    email: FormControl<string>;
    password: FormControl<string>;
    otpCode: FormControl<string>;
}

interface AccountRemoveFormValue {
    email: string;
    password: string;
}
export interface AccountRemoveResult {
    removed: boolean;
}

@Component({
    selector: 'giz-account-remove-dialog',
    templateUrl: './account-remove-dialog.component.html',
    styleUrl: './account-remove-dialog.component.scss',
    imports: [
        DialogComponent,
        ReactiveFormsModule,
        NgClass,
        SpinnerComponent,
        ButtonComponent,
        HasErrorPipe,
        HasValuePipe,
    ],
})
export class AccountRemoveDialogComponent implements OnInit, OnDestroy {
    public readonly authService = inject(AuthService);
    public mutation = this.authService.removeAccount();
    public invalidOtpCode = false;
    public invalidPassword = false;

    public form: FormGroup<AccountRemoveFormGroup> = new FormGroup(
        {
            email: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.email,
                ],
            }),
            password: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            otpCode: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.minLength(6),
                    Validators.maxLength(6),
                ],
            }),

        },
    );

    private readonly toastr = inject(ToastrService);
    private readonly router = inject(Router);
    private readonly destroyed$ = new Subject<void>();

    constructor(
        @Inject(DIALOG_DATA) public data: {
            user: User;
        },
        private readonly dialogRef: DialogRef<AccountRemoveResult>,
    ) {
        if (this.data.user.twoFactorEnabled) {
            this.form.controls.otpCode.addValidators(Validators.required);
        }
    }

    get title() {
        return $localize`:account-remove title:Remove your account`;
    }

    public ngOnInit() {
        this.form.controls.password.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this.invalidPassword = false;
            });
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public submit() {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.form.disable();
            const formValue = this.form.getRawValue() as AccountRemoveFormValue;

            this.invalidPassword = false;
            this.invalidOtpCode = false;

            this.mutation.mutate(formValue, {
                onSuccess: () => {
                    this.toastr.success($localize`:account-remove success:Successfully removed your account`);
                    this.dialogRef?.close({ removed: true });
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGOUT]);
                },
                onError: (error) => {
                    const errorBody = error.error as ErrorResponse;
                    const isBadRequest = errorBody.statusCode as STATUS === STATUS.BAD_REQUEST;
                    if (isBadRequest && errorBody.message.includes('Two-factor code is invalid')) {
                        this.invalidOtpCode = true;
                    }
                    else if (isBadRequest && errorBody.message.includes('Invalid credentials')) {
                        this.invalidPassword = true;
                    }
                    else {
                        this.toastr.error($localize`:account-remove error:Something went wrong while removing your account`);
                    }

                    this.form.enable();
                },
            });
        }
    }

    public cancel() {
        this.dialogRef?.close({ removed: false });
    }
}
