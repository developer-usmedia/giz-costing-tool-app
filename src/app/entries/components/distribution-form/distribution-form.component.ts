import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { Entry, ScenarioDistroForm } from '@api/models';

interface ScenarioDistroFormGroup {
    baseWagePerc: FormControl<number | null>;
    bonusesPerc: FormControl<number | null>;
    ikbPerc: FormControl<number | null>;
    ikbHousingPerc: FormControl<number | null>;
    ikbFoodPerc: FormControl<number | null>;
    ikbTransportPerc: FormControl<number | null>;
    ikbHealthcarePerc: FormControl<number | null>;
    ikbChildcarePerc: FormControl<number | null>;
    ikbChildEducationPerc: FormControl<number | null>;
}

@Component({
    selector: 'giz-distribution-form',
    templateUrl: './distribution-form.component.html',
    styleUrl: './distribution-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DistributionFormComponent {
    @Input({ required: true }) entry?: Entry;
    @Input() submitting = false;
    @Output() submitForm = new EventEmitter<ScenarioDistroForm>();

    public maxIkbPercMapping = {
        baseWagePerc: 100,
        bonusesPerc: 100,
        ikbPerc: 30,
        ikbHousingPerc: 15,
        ikbFoodPerc: 10,
        ikbTransportPerc: 10,
        ikbHealthcarePerc: 10,
        ikbChildcarePerc: 10,
        ikbChildEducationPerc: 10,
    } as const;


    // TODO: baseWage and ikbPerc are now not disabled even though the its specified in the form -> fix;

    public form: FormGroup<ScenarioDistroFormGroup> = new FormGroup({
        baseWagePerc: new FormControl<number | null>(
            { value: this.entry?.scenario?.distribution?.baseWagePerc ?? null, disabled: true },
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.baseWagePerc)] },
        ),
        bonusesPerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.bonusesPerc ?? null, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.bonusesPerc), Validators.required],
        }),
        ikbPerc: new FormControl<number | null>(
            { value: this.entry?.scenario?.distribution?.ikbPerc ?? null, disabled: true },
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbPerc)] },
        ),
        ikbHousingPerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.ikbHousingPerc ?? null, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbHousingPerc), Validators.required],
        }),
        ikbFoodPerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.ikbFoodPerc ?? null, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbFoodPerc), Validators.required],
        }),
        ikbTransportPerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.ikbTransportPerc ?? null, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbTransportPerc), Validators.required],
        }),
        ikbHealthcarePerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.ikbHealthcarePerc ?? null,
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbHealthcarePerc), Validators.required] },
        ),
        ikbChildcarePerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.ikbChildcarePerc ?? null, {
            validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbChildcarePerc), Validators.required],
        }),
        ikbChildEducationPerc: new FormControl<number | null>(
            this.entry?.scenario?.distribution?.ikbChildEducationPerc ?? null,
            { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.ikbChildEducationPerc), Validators.required] },
        ),
    });

    private readonly destroyed$ = new Subject<void>();

    constructor() {
        this.form.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$))
            .subscribe((formFields) => {
                this.updateIkbTotal(formFields);
            });
    }

    public updateIkbTotal(fields: Partial<ScenarioDistroFormGroup> | Record<string, any>): void {
        /* eslint-disable */
        const computedIkbTotal: number =
            fields.ikbHousingPerc +
            fields.ikbFoodPerc +
            fields.ikbTransportPerc +
            fields.ikbHealthcarePerc +
            fields.ikbChildcarePerc +
            fields.ikbChildEducationPerc;
        /* eslint-enable */

        const computedWage: number = 100 - fields.bonusesPerc - computedIkbTotal;

        this.form.patchValue(
            {
                baseWagePerc: computedWage,
                ikbPerc: computedIkbTotal,
            },
            { emitEvent: false }, // ! anti-infinte loop
        );

        this.form.get('baseWagePerc')?.markAsTouched();
        this.form.get('ikbPerc')?.markAsTouched();
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
        const {
            baseWagePerc,
            bonusesPerc,
            ikbPerc,
            ikbHousingPerc,
            ikbFoodPerc,
            ikbTransportPerc,
            ikbHealthcarePerc,
            ikbChildcarePerc,
            ikbChildEducationPerc,
        } = this.entry?.scenario?.distribution ?? {};

        this.form.patchValue({
            baseWagePerc,
            bonusesPerc,
            ikbPerc,
            ikbHousingPerc,
            ikbFoodPerc,
            ikbTransportPerc,
            ikbHealthcarePerc,
            ikbChildcarePerc,
            ikbChildEducationPerc,
        });
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.submitting = true;
            this.form.disable();
            const formValue = this.form.getRawValue();
            this.submitForm.emit(formValue as ScenarioDistroForm);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
