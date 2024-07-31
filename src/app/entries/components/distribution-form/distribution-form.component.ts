import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Distribution, DistributionForm, Worker } from '@api/models';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

interface DistributionFormGroup {
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

interface DistributionFormValue {
    baseWagePerc: number | null;
    bonusesPerc: number | null;
    ikbPerc: number | null;
    ikbHousingPerc: number | null;
    ikbFoodPerc: number | null;
    ikbTransportPerc: number | null;
    ikbHealthcarePerc: number | null;
    ikbChildcarePerc: number | null;
    ikbChildEducationPerc: number | null;
}

@Component({
    selector: 'giz-distribution-form',
    templateUrl: './distribution-form.component.html',
    styleUrl: './distribution-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DistributionFormComponent implements OnChanges, OnDestroy {
    @Input() distribution?: Distribution;
    @Input() worker?: Worker;
    @Input() inDialog = false;
    @Input() submitEvent = false;
    @Input() submitting = false;
    @Output() submitForm = new EventEmitter<DistributionForm>();

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
    };

    public form: FormGroup<DistributionFormGroup>;
    public isDisabled = false;

    private readonly destroyed$ = new Subject<void>();

    constructor() {
        this.form = this.buildForm();
        this.form.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroyed$))
            .subscribe((formFields) => {
                this.updateIkbTotal(formFields);
            });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['distribution'] && this.distribution) {
            this.patchForm();
        }

        if (changes['submitting'] && this.submitting) {
            this.form.disable();
            this.isDisabled = true;
        } else if (changes['submitting'] && !this.submitting) {
            this.isDisabled = false;
        }

        if (changes['submitEvent'] && this.submitEvent) {
            this.submit();
        }
    }

    public buildForm(): FormGroup<DistributionFormGroup> {
        return new FormGroup({
            baseWagePerc: new FormControl<number | null>(
                this.distribution?.baseWagePerc ?? 100,
                { validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.baseWagePerc)] },
            ),
            bonusesPerc: new FormControl<number | null>(
                this.distribution?.bonusesPerc ?? 0, {
                    validators: [Validators.min(0), Validators.max(this.maxIkbPercMapping.bonusesPerc), Validators.required],
                }),
            ikbPerc: new FormControl<number | null>(
                this.distribution?.ikbPerc ?? 0,
                { validators: [Validators.min(0)] },
            ),
            ikbHousingPerc: new FormControl<number | null>(
                this.distribution?.ikbHousingPerc ?? 0, {
                    validators: [Validators.required, Validators.min(0)],
                }),
            ikbFoodPerc: new FormControl<number | null>(
                this.distribution?.ikbFoodPerc ?? 0, {
                    validators: [Validators.required, Validators.min(0)],
                }),
            ikbTransportPerc: new FormControl<number | null>(
                this.distribution?.ikbTransportPerc ?? 0, {
                    validators: [Validators.required, Validators.min(0)],
                }),
            ikbHealthcarePerc: new FormControl<number | null>(
                this.distribution?.ikbHealthcarePerc ?? 0,
                { validators: [Validators.required, Validators.min(0)] },
            ),
            ikbChildcarePerc: new FormControl<number | null>(
                this.distribution?.ikbChildcarePerc ?? 0, {
                    validators: [Validators.required, Validators.min(0)],
                }),
            ikbChildEducationPerc: new FormControl<number | null>(
                this.distribution?.ikbChildEducationPerc ?? 0,
                { validators: [Validators.required, Validators.min(0)] },
            ),
        });
    }

    public updateIkbTotal(fields: Partial<DistributionFormValue>): void {
        const computedIkbTotal: number =
            (fields.ikbHousingPerc ?? 0) +
            (fields.ikbFoodPerc ?? 0) +
            (fields.ikbTransportPerc ?? 0) +
            (fields.ikbHealthcarePerc ?? 0) +
            (fields.ikbChildcarePerc ?? 0) +
            (fields.ikbChildEducationPerc ?? 0);

        const computedWage: number = 100 - (fields.bonusesPerc ?? 0) - computedIkbTotal;

        this.form.patchValue(
            {
                baseWagePerc: computedWage,
                ikbPerc: computedIkbTotal,
            },
            { emitEvent: false }, // ! anti-infinity loop
        );

        this.form.get('baseWagePerc')?.markAsTouched();
        this.form.get('ikbPerc')?.markAsTouched();
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
        } = this.distribution ?? {};

        this.form.patchValue({
            baseWagePerc: baseWagePerc ?? 0,
            bonusesPerc: bonusesPerc ?? 0,
            ikbPerc: ikbPerc ?? 0,
            ikbHousingPerc: ikbHousingPerc ?? 0,
            ikbFoodPerc: ikbFoodPerc ?? 0,
            ikbTransportPerc: ikbTransportPerc ?? 0,
            ikbHealthcarePerc: ikbHealthcarePerc ?? 0,
            ikbChildcarePerc: ikbChildcarePerc ?? 0,
            ikbChildEducationPerc: ikbChildEducationPerc ?? 0,
        });
    }

    public submit(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.submitting = true;
            this.form.disable();
            const formValue = this.parseFormValue();
            this.submitForm.emit(formValue);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private parseFormValue(): DistributionForm {
        const formValue = this.form.getRawValue() as DistributionFormValue;

        return {
            bonusesPerc: formValue.bonusesPerc ?? 0,
            ikbHousingPerc: formValue.ikbHousingPerc ?? 0,
            ikbFoodPerc: formValue.ikbFoodPerc ?? 0,
            ikbTransportPerc: formValue.ikbTransportPerc ?? 0,
            ikbHealthcarePerc: formValue.ikbHealthcarePerc ?? 0,
            ikbChildcarePerc: formValue.ikbChildcarePerc ?? 0,
            ikbChildEducationPerc: formValue.ikbChildEducationPerc ?? 0,
        };
    }
}
