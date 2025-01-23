import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { ResetPasswordForm } from '@api/models';
import { CustomValidators } from '@shared/services';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { NgClass } from '@angular/common';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface ResetPasswordFormGroup {
    password: FormControl<string>;
    passwordConfirm: FormControl<string>;
}

@Component({
    selector: 'giz-new-password',
    templateUrl: './new-password.component.html',
    styleUrl: './new-password.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        NgClass,
        PasswordStrengthComponent,
        SpinnerComponent,
        ButtonComponent,
        RouterLink,
        HasErrorPipe,
        HasValuePipe,
    ],
})
export class NewPasswordComponent implements OnChanges, OnDestroy {
    @Input() submitting = false;
    @Input() code = '';
    @Input() email = '';

    @Output() submitForm = new EventEmitter<ResetPasswordForm>();

    public form: FormGroup<ResetPasswordFormGroup> = new FormGroup(
        {
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
        },
        {
            validators: [CustomValidators.matchPassword],
        }
    );

    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;

    private readonly destroyed$ = new Subject<void>();

    get password(): AbstractControl | null {
        return this.form.controls.password;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['submitting'] && this.submitting) {
            this.form.disable();
        } else if (changes['submitting'] && !this.submitting) {
            this.form.enable();
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            const formValue = this.form.getRawValue();
            const form: ResetPasswordForm = {
                email: this.email,
                newPassword: formValue.password,
                resetToken: this.code,
            };
            this.submitForm.emit(form);
        }
    }

}
