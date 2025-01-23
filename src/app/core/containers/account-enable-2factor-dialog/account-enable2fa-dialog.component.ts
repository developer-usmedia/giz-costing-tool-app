import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { ErrorResponse, Verify2FAForm } from '@api/models';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
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

interface Verify2FAFormGroup {
    password: FormControl<string>;
    otpCode: FormControl<string>;
}

interface Verify2FAFormValue {
    password: string;
    otpCode: string;
}

export interface Enable2FAResult {
    enabled: boolean;
}

@Component({
    selector: 'giz-account-enable2-factor-dialog',
    templateUrl: './account-enable2fa-dialog.component.html',
    styleUrl: './account-enable2fa-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
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
export class AccountEnable2FaDialogComponent implements OnInit, OnDestroy {
    public readonly authService = inject(AuthService);
    public enableMutation = this.authService.enable2FA();
    public verifyMutation = this.authService.verify2FA();
    public wrongPassword = false;
    public wrongOTP = false;
    public qrImage?: string;
    public form: FormGroup<Verify2FAFormGroup> = new FormGroup(
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

    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);
    private readonly destroyed$ = new Subject<void>();

    constructor(
        private readonly dialogRef: DialogRef<Enable2FAResult>,
    ) {
    }

    get title() {
        return $localize`:2factor-enable title:Enable two-factor authentication`;
    }

    get intro() {
        return $localize`:2factor-enable intro:Two-Factor Authentication, or 2FA, significantly improves login security for your login.
        2FA works with a number of TOTP-based apps like LastPass, 1Password, FreeOTP,  Authy and more.`;
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

    public viewQR() {
        this.enableMutation.mutate( '', {
            onSuccess: (res) => {
                this.qrImage = res.qrcode;
            },
            onError: (error) => {
                const errorBody = error.error as ErrorResponse;
                const isBadRequest = errorBody.statusCode as STATUS === STATUS.BAD_REQUEST;
                if (isBadRequest && errorBody.message.includes('Email verification required')) {
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.EMAIL_VERIFICATION]);
                }
                else if (isBadRequest && errorBody.message.includes('2FA already enabled')) {
                    this.toastr.error($localize`:2factor-enable enabled error:Two-factor authentication is already enabled.`);
                }
                else {
                    this.toastr.error($localize`:2factor-enable qr error:Something went wrong getting the QR Code`);
                }
            },
        });
    }

    public submit() {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.wrongPassword = false;
            this.wrongOTP = false;

            this.form.disable();

            this.verifyMutation.mutate(this.getFormValue(), {
                onSuccess: () => {
                    this.toastr.success($localize`:2factor-enable success:Successfully enabled two-factor authentication.`);
                    this.dialogRef?.close({ enabled: true });
                },
                onError: (error) => {
                    const errorBody = error.error as ErrorResponse;
                    const isBadRequest = errorBody.statusCode as STATUS === STATUS.BAD_REQUEST;
                    if (isBadRequest && errorBody.message.includes('Invalid credentials')) {
                        this.wrongPassword = true;
                    }
                    else if (isBadRequest && errorBody.message.includes('Invalid verification code')) {
                        this.wrongOTP = true;
                    }
                    else if (isBadRequest && errorBody.message.includes('2FA is disabled')) {
                        this.toastr.error($localize`:2factor-enable disabled error:Two-factor authentication is disabled.`);
                    }
                    else {
                        this.toastr.error($localize`:2factor-enable error:Something went wrong while enabling two-factor authentication`);
                    }

                    this.form.enable();
                },
            });
        }
    }

    public cancel() {
        this.dialogRef?.close({ enabled: false });
    }

    public getFormValue(): Verify2FAForm {
        const formValue = this.form.getRawValue() as Verify2FAFormValue;

        return {
            password: formValue.password,
            otpCode: formValue.otpCode,
        };
    }
}
