import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-auth-content',
    templateUrl: './auth-content.component.html',
    styleUrl: './auth-content.component.scss',
    changeDetection:  ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AuthContentComponent {
    @Input({ required: true }) title!: string;
    @Input() description?: string;
    @Input() icon?: ICON;

    @HostBinding('class') cssClass = 'auth-content';
}
