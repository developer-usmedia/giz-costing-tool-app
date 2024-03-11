import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[giz-icon-button], a[giz-icon-button]',
    templateUrl: './icon-button.component.html',
    styleUrls: [ './icon-button.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
    @Input({ required: true }) icon!: ICON;
    @Input() buttonType: 'default' | 'stroke' = 'default';
    @Input() theme: 'basic' | 'primary' | 'warning' = 'primary';
    @Input() size: 'default' | 'small' = 'default';

    @Input()
    @HostBinding('disabled')
    disabled: boolean | null = null;

    @Input()
    @HostBinding('tabindex')
    tabindex: number = this.disabled ? -1 : 0;

    @HostBinding('class') cssClass = 'icon-button';

    @HostBinding('class.icon-button--stroke') get modStroke(): boolean {
        return this.buttonType === 'stroke';
    }

    @HostBinding('class.icon-button--primary') get modPrimary(): boolean {
        return this.theme === 'primary';
    }

    @HostBinding('class.icon-button--basic') get modBasic(): boolean {
        return this.theme === 'basic';
    }

    @HostBinding('class.icon-button--warning') get modWarning(): boolean {
        return this.theme === 'warning';
    }

    @HostBinding('class.icon-button--small') get modSmall(): boolean {
        return this.size === 'small';
    }
}
