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
    taxEmployee: FormControl<number | null>;
    taxEmployer: FormControl<number | null>;
    remunerationIncrease?: FormControl<number | null>;
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
            taxEmployee: new FormControl<number | null>(
                this.entry?.scenario?.specification?.taxEmployee ?? null,
                {
                    validators: [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(100),
                    ],
                },
            ),
            taxEmployer: new FormControl<number | null>(
                this.entry?.scenario?.specification?.taxEmployer ?? null,
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
            this.form.addControl('remunerationIncrease',
                new FormControl<number | null>(
                    this.entry?.scenario?.specification?.remunerationIncrease ?? null,
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
        // TODO: take a look at distribution-form.comp.ts -> patchForm to possible clean this up
        const taxEmployee = this.entry?.scenario?.specification?.taxEmployee;
        if (taxEmployee !== undefined && taxEmployee !== null) {
            this.form.patchValue({
                taxEmployee: taxEmployee,
            });
        }

        const taxEmployer = this.entry?.scenario?.specification?.taxEmployer;
        if (taxEmployer !== undefined && taxEmployer !== null) {
            this.form.patchValue({
                taxEmployer: taxEmployer,
            });
        }

        const remunerationIncrease = this.entry?.scenario?.specification?.remunerationIncrease;
        if (remunerationIncrease !== undefined && remunerationIncrease !== null) {
            this.form.patchValue({
                remunerationIncrease: remunerationIncrease,
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
