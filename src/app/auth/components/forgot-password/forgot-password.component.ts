import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordForm } from '@api/models';
import { MODULE_ROUTE, AUTH_ROUTE } from '@core/models';
import { CustomValidators } from '@shared/services';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

interface ForgotPasswordFormGroup {
    email: FormControl<string>;
}


@Component({
    selector: 'giz-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit, OnChanges, OnDestroy {
    @Input() submitting = false;

    @Output() submitForm = new EventEmitter<ForgotPasswordForm>();

    public form: FormGroup<ForgotPasswordFormGroup> = new FormGroup(
        {
            email: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.email,
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

    public ngOnInit() {
        this.form.controls.email.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            );
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
            const form: ForgotPasswordForm = {
                email: formValue.email,
            };
            this.submitForm.emit(form);
        }
    }
}
