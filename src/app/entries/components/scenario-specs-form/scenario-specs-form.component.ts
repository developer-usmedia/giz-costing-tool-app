import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Entry, ScenarioSpecsForm, ScenarioType } from '@api/models';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';

interface ScenarioSpecsFormGroup {
    employeeTax: FormControl<number | null>;
    employerTax: FormControl<number | null>;
    absoluteIncrease?: FormControl<number | null>;
}

@Component({
    selector: 'giz-scenario-specs-form',
    templateUrl: './scenario-specs-form.component.html',
    styleUrl: './scenario-specs-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ScenarioSpecsFormComponent implements OnInit, OnChanges {
    @Input({ required: true }) entry!: Entry;
    @Input({ required: true }) type!: ScenarioType;
    @Input() submitting = false;
    @Output() submitForm = new EventEmitter<ScenarioSpecsForm>();

    public form: FormGroup<ScenarioSpecsFormGroup> = new FormGroup(
        {
            employeeTax: new FormControl<number | null>(
                this.entry?.scenario?.specifications?.employeeTax ?? null,
                {
                    validators: [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(100),
                    ],
                },
            ),
            employerTax: new FormControl<number | null>(
                this.entry?.scenario?.specifications?.employerTax ?? null,
                {
                    validators: [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(100),
                    ],
                },
            ),
        },
    );

    protected readonly authroute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly scenarioType = ScenarioType;

    public ngOnInit() {
        if (this.type === ScenarioType.ABSOLUTE_INCREASE) {
            this.form.addControl('absoluteIncrease',
                new FormControl<number | null>(
                    this.entry?.scenario?.specifications?.absoluteIncrease ?? null,
                    {
                        validators: [
                            Validators.required,
                            Validators.min(0),
                        ],
                    }
                ),
            );
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['entry'] && this.entry) {
            this.patchForm();
        }

        if (changes['submitting'] && this.submitting) {
            this.form.disable();
        } else if (changes['submitting'] && !this.submitting) {
            this.form.enable();
        }
    }

    public patchForm() {
        const employeeTax = this.entry?.scenario?.specifications?.employeeTax;
        if (employeeTax !== undefined && employeeTax !== null) {
            this.form.patchValue({
                employeeTax: employeeTax,
            });
        }

        const employerTax = this.entry?.scenario?.specifications?.employerTax;
        if (employerTax !== undefined && employerTax !== null) {
            this.form.patchValue({
                employerTax: employerTax,
            });
        }

        const absoluteIncrease = this.entry?.scenario?.specifications?.absoluteIncrease;
        if (absoluteIncrease !== undefined && absoluteIncrease !== null) {
            this.form.patchValue({
                absoluteIncrease: absoluteIncrease,
            });
        }
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.submitting = true;
            this.form.disable();
            const formValue = this.form.getRawValue();
            this.submitForm.emit(formValue as ScenarioSpecsForm);
        }
    }
}
