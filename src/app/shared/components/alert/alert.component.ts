import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-alert',
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
    @Input() type: 'info' | 'warning' | 'error' = 'info';

    @HostBinding('class') cssClass = 'alert';

    protected readonly icon = ICON;

    @HostBinding('class.alert--warning') get modWarning(): boolean {
        return this.type === 'warning';
    }

    @HostBinding('class.alert--error') get modError(): boolean {
        return this.type === 'error';
    }
}
