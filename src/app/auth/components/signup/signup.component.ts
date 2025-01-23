import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { RegisterForm } from '@api/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { CustomValidators } from '@shared/services';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { NgClass } from '@angular/common';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface SignupFormGroup {
    email: FormControl<string>;
    password: FormControl<string>;
    passwordConfirm: FormControl<string>;
}

@Component({
    selector: 'giz-signup',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        NgClass,
        IconButtonComponent,
        TooltipDirective,
        PasswordStrengthComponent,
        SpinnerComponent,
        ButtonComponent,
        RouterLink,
        HasErrorPipe,
        HasValuePipe,
    ],
})
export class SignupComponent implements OnInit, OnChanges, OnDestroy {
    @Input() submitting = false;

    @Output() submitForm = new EventEmitter<RegisterForm>();

    public form: FormGroup<SignupFormGroup> = new FormGroup(
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
            validators: [ CustomValidators.matchPassword ],
        }
    );

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;

    private readonly destroyed$ = new Subject<void>();
    private _emailTaken?: boolean;

    get tooltipPassword(): string {
        return $localize`:password explanation:Password must be between 12 & 200 characters and must contain upper- and lowercase characters, numbers and special characters`;
    }

    get password(): AbstractControl | null {
        return this.form.controls.password;
    }

    get emailTaken(): boolean {
        return this._emailTaken === true;
    }

    @Input() set emailTaken(value: boolean) {
        this._emailTaken = value;
    }

    public ngOnInit() {
        this.form.controls.email.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this._emailTaken = false;
            });
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
            const form: RegisterForm = {
                email: formValue.email,
                password: formValue.password,
            };
            this.submitForm.emit(form);
        }
    }
}
