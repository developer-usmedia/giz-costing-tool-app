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
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { RouterLink } from '@angular/router';
import { HasErrorPipe, HasValuePipe } from '@shared/pipes';

interface ResetCodeFormGroup {
    resetCode: FormControl<string>;
}

@Component({
    selector: 'giz-reset',
    templateUrl: './reset.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        NgClass,
        ButtonComponent,
        SpinnerComponent,
        RouterLink,
        HasErrorPipe,
        HasValuePipe,
    ],
})
export class ResetComponent implements OnInit, OnChanges, OnDestroy {
    @Input() submitting = false;
    @Input() emailAddress = '';

    @Output() submitForm = new EventEmitter<string>();
    @Output() sendNewCode = new EventEmitter();

    public newCodeSent = false;

    public form: FormGroup<ResetCodeFormGroup> = new FormGroup({
        resetCode: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
            ],
        }),
    });

    protected readonly authRoute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    private readonly destroyed$ = new Subject<void>();
    private _codeInvalid?: boolean;

    get codeInvalid(): boolean {
        return this._codeInvalid === true;
    }

    @Input() set codeInvalid(value: boolean) {
        this._codeInvalid = value;
    }

    public ngOnInit() {
        this.form.controls.resetCode.valueChanges
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

    public submit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.submitForm.emit(this.form.getRawValue().resetCode);
        }
    }

    public sendCode() {
        this.newCodeSent = true;
        this.sendNewCode.emit();
    }
}
