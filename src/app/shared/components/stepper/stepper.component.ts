import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Stepper } from '@shared/components/stepper/stepper.model';
import { NgClass } from '@angular/common';

@Component({
    selector: 'giz-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: [ './stepper.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [NgClass],
})
export class StepperComponent {
    @Input() steps: Stepper[] = [];
    @Input() activeStep = 1;
}
