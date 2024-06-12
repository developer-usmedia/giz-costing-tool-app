import { APP_BASE_HREF } from '@angular/common';

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { Scenario } from '@core/models';

@Component({
    selector: 'giz-scenario-card',
    templateUrl: './scenario-card.component.html',
    styleUrl: './scenario-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ScenarioCardComponent {
    @Input({ required: true }) scenario!: Scenario;
    @Input() selectable = false;
    @Input() active = false;

    @Output() selected = new EventEmitter<Scenario>();

    @HostBinding('class') cssClass = 'scenario-card';

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
    ) {
    }

    @HostBinding('class.scenario-card--selectable') get modSelectable(): boolean {
        return this.selectable;
    }

    @HostBinding('class.scenario-card--active') get modActive(): boolean {
        return this.active;
    }

    public select(): void {
        this.selected.emit(this.scenario);
    }
}
