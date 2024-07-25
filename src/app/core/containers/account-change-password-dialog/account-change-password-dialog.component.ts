import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { ChangePasswordForm, User } from '@api/models';
import { AuthService, UserService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { CustomValidators } from '@shared/services';

interface ChangePasswordFormGroup {
    currentPassword: FormControl<string>;
    password: FormControl<string>;
    passwordConfirm: FormControl<string>;
    otpCode: FormControl<number | null>;
}

interface ChangePasswordFormValue {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
    otpCode?: number | null;
}

export interface AccountChangePasswordResult {
    updated: boolean;
}

@Component({
    selector: 'giz-account-change-password-dialog',
    templateUrl: './account-change-password-dialog.component.html',
    styleUrl: './account-change-password-dialog.component.scss',
})
export class AccountChangePasswordDialogComponent implements OnInit, OnDestroy {
    public readonly authService = inject(AuthService);
    public readonly userService = inject(UserService);
    public readonly user: CreateQueryResult<User, Error> = this.userService.getUser();
    public mutation = this.authService.changePassword();
    public wrongPassword = false;
    public wrongOTP = false;

    public form: FormGroup<ChangePasswordFormGroup> = new FormGroup(
        {
            currentPassword: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            password: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    CustomValidators.passwordLength,
                    CustomValidators.passwordUpperAndLowerCase,
                    CustomValidators.passwordNumbers,
                    CustomValidators.passwordSpecialCharacters,
                ],
            }),
            passwordConfirm: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            otpCode: new FormControl<number | null>(null, {
                nonNullable: true,
                validators: [], // Added in onInit when we know the user
            }),
        },
        {
            validators: [ CustomValidators.matchPassword ],
        }
    );

    protected readonly icon = ICON;
    private readonly toastr = inject(ToastrService);
    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly dialogRef: DialogRef<AccountChangePasswordResult>,
    ) {
    }

    get title() {
        return $localize`:change-password title:Change your password`;
    }

    get tooltipOTP(): string {
        return $localize`:otp explanation:This is the 2factor code you can view in your authenticator app.`;
    }

    get tooltipPassword(): string {
        return $localize`:password explanation:Password must be between 12 & 200 characters and must contain upper- and lowercase characters, numbers and special characters<  `;
    }

    get password(): AbstractControl | null {
        return this.form.controls.password;
    }

    public ngOnInit() {
        if (this.user.data()?.twoFactorEnabled) {
            this.form.controls.otpCode.addValidators(Validators.required);
        }

        this.form.controls.password.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this.wrongPassword = false;
            });

        this.form.controls.otpCode.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this.wrongOTP = false;
            });
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.wrongPassword = false;
            this.wrongOTP = false;

            this.form.disable();
            const formValue = this.parseFormValue();
            this.mutation.mutate(formValue, {
                onSuccess: () => {
                    this.toastr.success($localize`:change-password success:Successfully changed password`);
                    this.dialogRef?.close({ updated: true });
                },
                onError: (error: Error) => {
                    // TODO HOW TO CHECK FOR WRONG PASSWORD OR OTP
                    // if (error.status === STATUS.BAD_REQUEST) {
                    //     this.wrongPassword = true;
                    // }

                    console.error(error);
                    this.toastr.error($localize`:change-password error:Something went wrong changing your password`);
                    this.dialogRef?.close({ updated: false });
                },
            });
        }
    }

    public cancel() {
        this.dialogRef?.close({ updated: false });
    }

    private parseFormValue(): ChangePasswordForm {
        const formValue = this.form.getRawValue() as ChangePasswordFormValue;

        return {
            currentPassword: formValue.currentPassword,
            password: formValue.password,
            otpCode: formValue.otpCode ?? undefined,
        };
    }
}
