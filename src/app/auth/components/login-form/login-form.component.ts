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
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginForm } from '@api/models';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

interface LoginFormGroup {
    email: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    selector: 'giz-login-form',
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit, OnChanges, OnDestroy {
    @Input() submitting = false;
    @Input() locked = false;

    @Output() submitForm = new EventEmitter<LoginForm>();

    public form: FormGroup<LoginFormGroup> = new FormGroup(
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
        },
    );

    protected readonly authroute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;

    private readonly destroyed$ = new Subject<void>();
    private _wrongPassword = false;

    get password(): AbstractControl | null {
        return this.form.controls.password;
    }

    get wrongPassword(): boolean {
        return this._wrongPassword;
    }

    @Input() set wrongPassword(value: boolean) {
        this._wrongPassword = value;
    }

    public ngOnInit() {
        this.form.controls.password.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this._wrongPassword = false;
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
            const form: LoginForm = {
                email: formValue.email,
                password: formValue.password,
            };
            this.submitForm.emit(form);
        }
    }
}
