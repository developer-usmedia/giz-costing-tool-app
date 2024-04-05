import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Stepper } from '@shared/components/stepper/stepper.model';

@Component({
    selector: 'giz-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class StepperComponent {
    @Input() steps: Stepper[] = [];
    @Input() activeStep = 1;
}
