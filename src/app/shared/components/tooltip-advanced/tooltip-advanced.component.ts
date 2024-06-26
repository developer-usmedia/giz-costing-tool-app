import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-tooltip-advanced',
    templateUrl: './tooltip-advanced.component.html',
    styleUrl: './tooltip-advanced.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TooltipAdvancedComponent {
    @Input({ required: true }) text!: string;
    @Input() button?: { label: string; link: string | any[] };

    @Output() closeTooltip = new EventEmitter();

    @HostBinding('class') cssClass = 'tooltip-advanced';

    protected readonly icon = ICON;

    public close(): void {
        this.closeTooltip.emit();
    }
}

