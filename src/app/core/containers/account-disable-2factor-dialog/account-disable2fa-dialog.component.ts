import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Disable2FAForm, ErrorResponse } from '@api/models';
import { AuthService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { STATUS } from '@shared/helpers';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { NgClass } from '@angular/common';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { TooltipAdvancedDirective } from '@shared/directives/tooltip-advanced.directive';
import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface Disable2FAFormGroup {
    password: FormControl<string>;
    otpCode: FormControl<string>;
}

interface Disable2FAFormValue {
    password: string;
    otpCode: string;
}

export interface Disable2FAResult {
    disabled: boolean;
}

@Component({
    selector: 'giz-account-disable2-factor-dialog',
    templateUrl: './account-disable2fa-dialog.component.html',
    styleUrl: './account-disable2fa-dialog.component.scss',
    imports: [
        DialogComponent,
        ReactiveFormsModule,
        NgClass,
        IconButtonComponent,
        TooltipAdvancedDirective,
        TooltipAdvancedComponent,
        SpinnerComponent,
        ButtonComponent,
        HasErrorPipe,
        HasValuePipe,
    ],
})
export class AccountDisable2FaDialogComponent implements OnInit, OnDestroy {
    public readonly authService = inject(AuthService);
    public mutation = this.authService.disable2FA();
    public wrongPassword = false;
    public wrongOTP = false;
    public form: FormGroup<Disable2FAFormGroup> = new FormGroup(
        {
            password: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            otpCode: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(6),
                ],
            }),
        },
    );

    protected readonly icon = ICON;

    private readonly toastr = inject(ToastrService);
    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly dialogRef: DialogRef<Disable2FAResult>,
    ) {
    }

    get title() {
        return $localize`:2factor-disable title:Disable two-factor authentication`;
    }

    public ngOnInit() {
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

    public submit() {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.wrongPassword = false;
            this.wrongOTP = false;

            this.form.disable();

            this.mutation.mutate(this.getFormValue(), {
                onSuccess: () => {
                    this.toastr.success($localize`:2factor-disable success:Successfully disabled two-factor authentication`);
                    this.dialogRef?.close({ disabled: true });
                },
                onError: (error) => {
                    const errorBody = error.error as ErrorResponse;
                    const isBadRequest = errorBody.statusCode as STATUS === STATUS.BAD_REQUEST;
                    if (isBadRequest && errorBody.message.includes('Invalid credentials')) {
                        this.wrongPassword = true;
                    }
                    else if (errorBody.message.includes('Two-factor code is invalid')) {
                        this.wrongOTP = true;
                    }
                    else {
                        this.toastr.error($localize`:2factor-disable error:Something went wrong while disabling two-factor authentication`);
                    }
                    this.form.enable();
                },
            });
        }
    }

    public cancel() {
        this.dialogRef?.close({ disabled: false });
    }

    public getFormValue(): Disable2FAForm {
        const formValue = this.form.getRawValue() as Disable2FAFormValue;

        return {
            password: formValue.password,
            otpCode: formValue.otpCode,
        };
    }
}
