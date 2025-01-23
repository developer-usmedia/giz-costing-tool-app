import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[giz-tab], a[giz-tab]',
    templateUrl: './tab.component.html',
    styleUrls: [ './tab.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TabComponent {
    @Input() disabled = false;

    @HostBinding('class') cssClass = 'tab';

    @HostBinding('class.is-disabled') get modDisabled(): boolean {
        return this.disabled;
    }
}
