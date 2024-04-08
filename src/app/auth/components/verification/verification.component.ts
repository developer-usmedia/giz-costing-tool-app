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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '@api/models';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AUTH_ROUTE } from '@core/models';

interface VerificationFormGroup {
    verificationCode: FormControl<string>;
}

@Component({
    selector: 'giz-verification',
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationComponent implements OnInit, OnChanges, OnDestroy {
    @Input({ required: true }) loginDetails!: LoginForm;
    @Input() submitting = false;

    @Output() submitForm = new EventEmitter<string>();
    @Output() sendNewCode = new EventEmitter();

    public newCodeSent = false;

    public form: FormGroup<VerificationFormGroup> = new FormGroup({
        verificationCode: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
            ],
        }),
    });

    protected readonly authRoute = AUTH_ROUTE;
    private readonly destroyed$ = new Subject<void>();
    private _codeInvalid?: boolean;

    get codeInvalid(): boolean {
        return this._codeInvalid === true;
    }
    @Input() set codeInvalid(value: boolean) {
        this._codeInvalid = value;
        this.newCodeSent = false;
    }

    public ngOnInit() {
        this.form.controls.verificationCode.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => {
                this._codeInvalid = false;
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

    public sendCode() {
        this.newCodeSent = true;
        this.sendNewCode.emit();
    }

    public submit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.submitForm.emit(this.form.getRawValue().verificationCode);
        }
    }
}
