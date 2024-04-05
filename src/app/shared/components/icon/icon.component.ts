import {
    Attribute,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-icon',
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
    @Input({ required: true }) icon!: ICON;
    @Input() size: 'small' | 'default' | 'large' = 'default';

    @HostBinding('role') role = 'img';
    @HostBinding('class') cssClass = 'icon';

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        @Attribute('aria-hidden') ariaHidden: string,
    ) {
        // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
        // the right thing to do for the majority of icon use-cases.
        if (!ariaHidden) {
            this.elementRef.nativeElement.setAttribute('aria-hidden', 'true');
        }
    }

    @HostBinding('class.icon--small') get small(): boolean {
        return this.size === 'small';
    }

    @HostBinding('class.icon--large') get large(): boolean {
        return this.size === 'large';
    }

    get href(): string {
        return `/assets/images/icons.svg#${ this.icon }`;
    }
}
