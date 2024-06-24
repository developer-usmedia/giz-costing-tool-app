import { APP_BASE_HREF } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

import { Entry, Scenario, ScenarioSpecsForm, ScenarioType } from '@api/models';
import { ScenarioInfo } from '@core/models';

@Component({
    selector: 'giz-scenario',
    templateUrl: './scenario.component.html',
    styleUrl: './scenario.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ScenarioComponent {
    @Input({ required: true }) scenario!: ScenarioInfo;
    @Input({ required: true }) entry?: Entry;
    @Input() specs?: Scenario;
    @Input() saving?: boolean;
    @Input() state?: 'edit' | 'view' = 'edit';

    @Output() submitSpecs = new EventEmitter<ScenarioSpecsForm>();

    protected readonly scenarioType = ScenarioType;

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
    ) {
    }

    public onSubmitSpecs(scenarioForm: ScenarioSpecsForm) {
        this.submitSpecs.emit(scenarioForm);
    }
}
