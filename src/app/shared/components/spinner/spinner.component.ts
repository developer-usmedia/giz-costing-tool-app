import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-spinner',
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
    @Input() theme: 'primary' | 'grey' | 'darkgrey' = 'primary';
    @Input() size: 'default' | 'large' = 'default';

    @HostBinding('class') cssClass = 'spinner';

    @HostBinding('class.spinner--grey') get modGrey(): boolean {
        return this.theme === 'grey';
    }

    @HostBinding('class.spinner--darkgrey') get modDarkGrey(): boolean {
        return this.theme === 'darkgrey';
    }

    @HostBinding('class.spinner--large') get modLarge(): boolean {
        return this.size === 'large';
    }
}
