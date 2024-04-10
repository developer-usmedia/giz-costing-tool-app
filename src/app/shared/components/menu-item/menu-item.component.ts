import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { CdkMenuItem } from '@angular/cdk/menu';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[giz-menu-item], a[giz-menu-item]',
    templateUrl: './menu-item.component.html',
    styleUrl: './menu-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [ CdkMenuItem ],
})
export class MenuItemComponent {
    @Input() active = false;
    @Input() icon?: ICON;

    @HostBinding('class') cssClass = 'menu-item';

    protected readonly icons = ICON;

    @HostBinding('class.menu-item--active') get modActive(): boolean {
        return this.active;
    }
}
