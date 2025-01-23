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
import { ICON } from '@shared/components/icon/icon.enum';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { NgClass } from '@angular/common';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface TwoFactorFormGroup {
    otpCode: FormControl<string>;
}

@Component({
    selector: 'giz-twofactor-form',
    templateUrl: './twofactor-form.component.html',
    styleUrl: './twofactor-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        NgClass,
        IconButtonComponent,
        TooltipDirective,
        SpinnerComponent,
        ButtonComponent,
        HasErrorPipe,
        HasValuePipe,
    ],
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

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authroute = AUTH_ROUTE;

    private readonly destroyed$ = new Subject<void>();
    private _wrongOTP = false;

    get tooltipOTP(): string {
        return $localize`:otp explanation:This is the 2factor code you can view in your authenticator app.`;
    }

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
