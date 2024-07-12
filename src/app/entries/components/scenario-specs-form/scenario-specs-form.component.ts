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
    overheadCosts: FormControl<number | null>;
    remunerationIncrease: FormControl<number | null>;
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

    public form: FormGroup<ScenarioSpecsFormGroup> = new FormGroup({
        taxEmployee: new FormControl<number | null>(
            this.entry?.scenario?.specification?.taxEmployee ?? null,
            {
                validators: [Validators.required, Validators.min(0), Validators.max(100)],
            }
        ),
        taxEmployer: new FormControl<number | null>(
            this.entry?.scenario?.specification?.taxEmployer ?? null,
            {
                validators: [Validators.required, Validators.min(0), Validators.max(100)],
            }
        ),
        overheadCosts: new FormControl<number | null>(
            this.entry?.scenario?.specification?.overheadCosts ?? null,
            {
                validators: [Validators.min(0), Validators.max(999999999)],
            }
        ),
        remunerationIncrease: new FormControl<number | null>(
            this.entry?.scenario?.specification?.remunerationIncrease ?? null,
            {
                validators: [Validators.min(0)], // Required is added in onInit
            },
        ),
    });

    protected readonly authroute = AUTH_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly scenarioType = ScenarioType;

    public ngOnInit() {
        if (this.type === ScenarioType.ABSOLUTE_INCREASE) {
            // TODO: Thisneeds fixing before merge
            this.form.controls.remunerationIncrease.addValidators(Validators.required);
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
        const taxEmployee = this.entry?.scenario?.specification?.taxEmployee;
        const taxEmployer = this.entry?.scenario?.specification?.taxEmployer;
        const overheadCosts = this.entry?.scenario?.specification?.overheadCosts;
        const remunerationIncrease = this.entry?.scenario?.specification?.remunerationIncrease;

        this.form.patchValue({
            taxEmployee: taxEmployee ?? null,
            taxEmployer: taxEmployer ?? null,
            overheadCosts: overheadCosts ?? null,
            remunerationIncrease: remunerationIncrease ?? null,

        });
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.submitting = true;
            this.form.disable();
            const formValue = this.form.getRawValue();
            const formData: ScenarioSpecsForm = {
                taxEmployee: formValue.taxEmployee ?? 0,
                taxEmployer: formValue.taxEmployer ?? 0,
                overheadCosts: formValue.overheadCosts ?? 0,
                remunerationIncrease: formValue.remunerationIncrease ?? 0,
            };
            this.submitForm.emit(formData);
        }
    }
}
