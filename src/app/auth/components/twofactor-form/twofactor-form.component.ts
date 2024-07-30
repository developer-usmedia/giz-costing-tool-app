import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges, OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';

interface TwoFactorFormGroup {
    otpCode: FormControl<string>;
}

@Component({
    selector: 'giz-twofactor-form',
    templateUrl: './twofactor-form.component.html',
    styleUrl: './twofactor-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwofactorFormComponent implements OnInit, OnChanges, OnDestroy {
    @Input() submitting = false;

    @Output() submitForm = new EventEmitter<string>();
    @Output() backToLogin = new EventEmitter();

    public form: FormGroup<TwoFactorFormGroup> = new FormGroup(
        {
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

    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authroute = AUTH_ROUTE;

    private readonly destroyed$ = new Subject<void>();
    private _wrongOTP = false;

    get wrongOTP(): boolean {
        return this._wrongOTP;
    }

    @Input() set wrongOTP(value: boolean) {
        this._wrongOTP = value;
    }

    public ngOnInit() {
        this.form.controls.otpCode.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this._wrongOTP = false;
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
            this.submitForm.emit(formValue.otpCode);
        }
    }

    public back(): void {
        this.backToLogin.emit();
    }
}
