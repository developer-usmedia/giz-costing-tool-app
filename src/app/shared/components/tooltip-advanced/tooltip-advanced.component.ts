import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding, Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
    selector: 'giz-tooltip-advanced',
    templateUrl: './tooltip-advanced.component.html',
    styleUrl: './tooltip-advanced.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [IconButtonComponent],
})
export class TooltipAdvancedComponent {
    @Input() size: 'small' | 'medium' = 'small';
    @Output() closeTooltip = new EventEmitter();

    @HostBinding('class') cssClass = 'tooltip-advanced';

    protected readonly icon = ICON;

    @HostBinding('class.tooltip-advanced--medium') get modMedium(): boolean {
        return this.size === 'medium';
    }

    public close(): void {
        this.closeTooltip.emit();
    }
}
